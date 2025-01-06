import { Repository } from 'sequelize-typescript';
import * as argon from 'argon2';
import { nanoid } from 'nanoid';

import { Injectable } from '@nestjs/common';

import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from 'src/common/exceptions';

import { JwtService } from '@nestjs/jwt';

import { SignInDto, SignUpDto } from './dto';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import {
  AccessToken,
  RefreshToken,
  TokensCreationAttributes,
  TokensPayload,
} from './interfaces';
import { InjectModel } from '@nestjs/sequelize';
import { UserRefreshTokenModel } from './models/user-refresh-tokens.model';
import { RolesEnum } from 'src/configs/roles';
import {
  USER_EMAIL_EXIST,
  USER_LOGIN_EXIST,
  USER_TELEGRAM_EXIST,
  WRONG_SIGNIN_DATA,
} from 'src/constants';
import { Mode } from 'src/types';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(UserRefreshTokenModel)
    private userRefreshTokenRepository: Repository<UserRefreshTokenModel>,

    private readonly userService: UsersService,
    private readonly rolesService: RolesService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async signUp(dto: SignUpDto) {
    const { login, telegram: tg, email } = dto;

    const existUser = await this.userService.getByCredential(login, 'login');
    if (existUser) throw new ConflictException('login', USER_LOGIN_EXIST);

    const existTg = await this.userService.getByCredential(tg, 'telegram');
    if (existTg) throw new ConflictException('telegram', USER_TELEGRAM_EXIST);

    const existEmail = await this.userService.getByCredential(email, 'email');
    if (existEmail) throw new ConflictException('email', USER_EMAIL_EXIST);

    const mode = this.configService.get<Mode>('NODE_ENV');

    if (mode === 'production') {
      // TODO: logic with telegram
    }

    const password = await this.hashPassword(dto.password);
    const { id: roleId } = await this.rolesService.getRoleByName(
      RolesEnum.EMPLOYEE,
    );

    const newUser = await this.userService.create({
      ...dto,
      password,
      roleId,
      telegram: tg.toLowerCase(),
      isActive: true,
    });
    const user_id = newUser.id;

    const { name: role } = await this.rolesService.getRoleById(roleId);
    const payload = { user_id, login, role };
    const tokensData = await this.generateTokens(payload);

    const token_id = tokensData.refresh_token_id;
    await this.saveRefreshToken({ token_id, user_id });

    const { type, access_token, refresh_token } = tokensData;
    return { type, access_token, refresh_token };
  }

  async signIn(dto: SignInDto) {
    const { login_or_tg, password } = dto;
    const user = await this.userService.getUserByLoginOrTelegram(login_or_tg);
    if (!user) throw new BadRequestException('wrong', WRONG_SIGNIN_DATA);

    const isPwdMatch = await this.comparePassword(user.password, password);
    if (!isPwdMatch) throw new BadRequestException('wrong', WRONG_SIGNIN_DATA);

    const user_id = user.id;
    const { login } = user;

    const { name: role } = await this.rolesService.getRoleById(user.roleId);
    const payload = { user_id, login, role };
    const tokensData = await this.generateTokens(payload);

    await this.userRefreshTokenRepository.destroy({ where: { user_id } });

    const token_id = tokensData.refresh_token_id;
    await this.saveRefreshToken({ token_id, user_id });

    const { type, access_token, refresh_token } = tokensData;
    return { type, access_token, refresh_token };
  }

  async refreshToken(old_refresh_token: string) {
    const validToken = await this.verifyUserByRefreshToken(old_refresh_token);
    if (!validToken) throw new UnauthorizedException();

    const { user_id } = validToken;

    const activeToken = await this.userRefreshTokenRepository.findByPk(
      validToken.token_id,
    );
    if (!activeToken) throw new UnauthorizedException();

    const user = await this.userService.getUserById(user_id);
    if (!user) throw new UnauthorizedException();

    await activeToken.destroy();

    const { login } = user;
    const { name: role } = await this.rolesService.getRoleById(user.roleId);
    const payload = { user_id, login, role };
    const tokensData = await this.generateTokens(payload);

    const { type, access_token, refresh_token } = tokensData;
    const token_id = tokensData.refresh_token_id;

    await this.saveRefreshToken({ token_id, user_id });

    return { type, access_token, refresh_token };
  }

  async logout(user_id: number) {
    await this.userRefreshTokenRepository.destroy({ where: { user_id } });
    return { is_logout: true };
  }

  // #region INTERNAL

  private async saveRefreshToken(data: TokensCreationAttributes) {
    await this.userRefreshTokenRepository.create({ ...data });
  }

  private async verifyUserByRefreshToken(token: string) {
    try {
      const secret = await this.configService.get('REFRESH_TOKEN_SECRET');
      const payload = this.jwtService.verify<RefreshToken>(token, {
        secret,
      });
      if (typeof payload === 'object' && 'login' in payload) return payload;
      return null;
    } catch (error) {
      return null;
    }
  }

  private async hashPassword(data: string): Promise<string> {
    return await argon.hash(data);
  }

  private async comparePassword(hashedPassword: string, password: string) {
    return await argon.verify(hashedPassword, password);
  }

  private async generateTokens(payload: TokensPayload) {
    const refresh_token_id = nanoid();
    const type = 'Bearer';

    const access_token = await this.generateAccessToken(payload);
    const refresh_token = await this.generateRefreshToken({
      ...payload,
      token_id: refresh_token_id,
    });

    return { type, access_token, refresh_token, refresh_token_id };
  }

  private async generateAccessToken(payload: AccessToken) {
    const secret = await this.configService.get('ACCESS_TOKEN_SECRET');
    const expiresIn = await this.configService.get('ACCESS_TOKEN_LIFETIME');

    const options = { secret, expiresIn };
    return await this.jwtService.signAsync(payload, options);
  }

  private async generateRefreshToken(payload: RefreshToken) {
    const secret = await this.configService.get('REFRESH_TOKEN_SECRET');
    const expiresIn = await this.configService.get('REFRESH_TOKEN_LIFETIME');

    const options = { secret, expiresIn };
    return await this.jwtService.signAsync(payload, options);
  }
}
