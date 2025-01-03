import { Repository } from 'sequelize-typescript';
import * as argon from 'argon2';
import { nanoid } from 'nanoid';

import { Injectable } from '@nestjs/common';

import {
  ConflictException,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from 'src/common/exceptions';

import { JwtService } from '@nestjs/jwt';

import { SignUpDto, SignInDto, SendCodeDto } from './dto';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import {
  AccessToken,
  RefreshToken,
  TokensCreationAttributes,
  TokensPayload,
} from './interfaces';
import { InjectModel } from '@nestjs/sequelize';
import { RefreshTokenModel } from './models/tokens.model';
import { RolesEnum } from 'src/configs/roles';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(RefreshTokenModel)
    private refreshTokenRepository: Repository<RefreshTokenModel>,

    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  private async saveRefreshToken(data: TokensCreationAttributes) {
    await this.refreshTokenRepository.create({ ...data });
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
