import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OAuthCodesModel } from './models/oauth-codes.model';
import { Repository } from 'sequelize-typescript';
import { ClientRefreshTokensModel } from './models/client-refresh-tokens.model';
import { ConsentsModel } from './models/consents.model';
import { AuthorizeDto, ExchangeAuthCodeDto, RefreshOAuthTokenDto } from './dto';
import {
  BadRequestException,
  UnauthorizedException,
} from 'src/common/exceptions';
import {
  ACCESS_DENIED,
  CODE_CHALLENGE_METHOD_INCORRECT,
  OAUTH_CODE_EXPIRED,
} from 'src/constants';
import { ClientsService } from 'src/clients/clients.service';
import { nanoid } from 'nanoid';
import { addMinutes, isAfter } from 'date-fns';
import { AUTH_CODE_LENGTH, AUTH_CODE_TTL } from 'src/configs/oauth';
import crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  CreateAuthCodeAttributes,
  CreateConsentAttributes,
  CreateOAuthTokensAttributes,
  OAuthTokenPayload,
} from './interfaces';

@Injectable()
export class OauthService {
  constructor(
    /* Models */
    @InjectModel(OAuthCodesModel)
    private oauthCodesRepository: Repository<OAuthCodesModel>,
    @InjectModel(ClientRefreshTokensModel)
    private refreshTokesRepository: Repository<ClientRefreshTokensModel>,
    @InjectModel(ConsentsModel)
    private consentsRepository: Repository<ConsentsModel>,

    /* Services */
    private readonly clientsService: ClientsService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async authorize(dto: AuthorizeDto, userId: number) {
    const { clientId, codeChallengeMethod, redirectUri, scope, state } = dto;
    const client = await this.clientsService.getClientByClientId(clientId);

    if (codeChallengeMethod !== 'S256') {
      throw new BadRequestException(
        'codeChallengeMethod',
        CODE_CHALLENGE_METHOD_INCORRECT,
      );
    }

    if (redirectUri && redirectUri !== client.redirectUri) {
      throw new BadRequestException('redirectUri', ACCESS_DENIED);
    }

    const expiresAt = addMinutes(new Date(), AUTH_CODE_TTL);
    const code = nanoid(AUTH_CODE_LENGTH);

    await this.saveAuthCode({
      ...dto,
      code,
      userId,
      expiresAt,
      state: state || null,
      redirectUri: client.redirectUri,
    });
    await this.saveConsent({ userId, clientId, scope });

    const url = `${client.redirectUri}?code=${code}&state=${state}`;
    return { url };
  }

  async exchangeAuthCode(dto: ExchangeAuthCodeDto) {
    const { clientId, code, codeVerifier } = dto;

    const client = await this.clientsService.getClientByClientId(clientId);
    const oauthCode = await this.oauthCodesRepository.findOne({
      where: { code, clientId },
    });
    if (!oauthCode) throw new BadRequestException('code', ACCESS_DENIED);

    const isOauthCodeValid = isAfter(oauthCode.expiresAt, new Date());
    if (!isOauthCodeValid) {
      throw new BadRequestException('code', OAUTH_CODE_EXPIRED);
    }

    // TODO:
    // this.validateCodeVerifier(codeVerifier, oauthCode.codeChallenge);
    const activeToken = await this.getTokenByClientId(clientId);
    if (activeToken) await activeToken.destroy();
    await oauthCode.destroy();

    const tokensPayload: OAuthTokenPayload = {
      clientId,
      clientName: client.name,
      userId: oauthCode.userId,
      scope: oauthCode.scope,
      tokenId: '',
    };
    const { access_token, refresh_token, type, refreshTokenId } =
      await this.generateTokens(tokensPayload, client.clientSecret);

    await this.saveToken({ ...tokensPayload, tokenId: refreshTokenId });

    return { access_token, refresh_token, type, scope: tokensPayload.scope };
  }

  async refreshOAuthToken(dto: RefreshOAuthTokenDto, clientId: string) {
    const { refreshToken } = dto;
    const client = await this.clientsService.getClientByClientId(clientId);
    const tokenPayload = await this.verifyClientByRefreshToken(
      refreshToken,
      client.clientSecret,
    );
    if (!tokenPayload) throw new UnauthorizedException();

    const activeToken = await this.getTokenByTokenId(tokenPayload.tokenId);
    if (!activeToken) throw new UnauthorizedException();

    await activeToken.destroy();

    const { access_token, refresh_token, type, refreshTokenId } =
      await this.generateTokens(tokenPayload, client.clientSecret);

    await this.saveToken({ ...tokenPayload, tokenId: refreshTokenId });

    return { access_token, refresh_token, type };
  }

  async revokeToken(clientId: string) {
    const activeToken = await this.getTokenByClientId(clientId);
    if (!activeToken) throw new UnauthorizedException();
    await activeToken.destroy();
  }

  // #region: GET */

  private async getAuthCodeByClientId(clientId: string) {
    return await this.oauthCodesRepository.findOne({
      where: { clientId },
    });
  }

  private async getTokenByClientId(clientId: string) {
    return await this.refreshTokesRepository.findOne({
      where: { clientId },
    });
  }

  private async getTokenByTokenId(tokenId: string) {
    return await this.refreshTokesRepository.findByPk(tokenId);
  }

  // #region: CREATE */

  private async saveToken(payload: CreateOAuthTokensAttributes) {
    const expiresAt = addMinutes(new Date(), 60);

    const existToken = await this.getTokenByClientId(payload.clientId);
    if (existToken) await existToken.destroy();

    return await this.refreshTokesRepository.create({
      tokenId: payload.tokenId,
      userId: payload.userId,
      clientId: payload.clientId,
      scope: payload.scope,
      expiresAt,
    });
  }

  private async saveConsent(payload: CreateConsentAttributes) {
    return await this.consentsRepository.create(payload);
  }

  private async saveAuthCode(payload: CreateAuthCodeAttributes) {
    const existCode = await this.getAuthCodeByClientId(payload.clientId);
    if (existCode) await existCode.destroy();
    return await this.oauthCodesRepository.create(payload);
  }

  // #region: INTERNAL */

  private async generateTokens(payload: OAuthTokenPayload, secret: string) {
    const refreshTokenId = nanoid();
    const type = 'Bearer';

    const access_token = await this.generateAccessToken(
      { ...payload, tokenId: refreshTokenId },
      secret,
    );
    const refresh_token = await this.generateRefreshToken(
      { ...payload, tokenId: refreshTokenId },
      secret,
    );

    return { type, access_token, refresh_token, refreshTokenId };
  }

  private async generateAccessToken(
    payload: OAuthTokenPayload,
    secret: string,
  ) {
    const expiresIn = await this.configService.get('ACCESS_TOKEN_LIFETIME');

    const options = { secret, expiresIn };
    return await this.jwtService.signAsync(payload, options);
  }

  private async generateRefreshToken(
    payload: OAuthTokenPayload,
    secret: string,
  ) {
    const expiresIn = await this.configService.get('REFRESH_TOKEN_LIFETIME');

    const options = { secret, expiresIn };
    return await this.jwtService.signAsync(payload, options);
  }

  private async verifyClientByRefreshToken(
    oldRefreshToken: string,
    secret: string,
  ) {
    try {
      const payload = this.jwtService.verify<OAuthTokenPayload>(
        oldRefreshToken,
        { secret },
      );
      if (typeof payload === 'object' && 'clientId' in payload) return payload;
      return null;
    } catch (error) {
      return null;
    }
  }

  private validateCodeVerifier(codeVerifier: string, codeChallenge: string) {
    const hash = crypto.createHash('sha256');
    hash.update(codeVerifier);
    const hashedCodeVerifier = hash.digest('base64url');

    if (hashedCodeVerifier !== codeChallenge) {
      throw new BadRequestException('codeVerifier', ACCESS_DENIED);
    }
  }

  async validateAccessTokenByTokenId(tokenId: string) {
    const token = await this.getTokenByTokenId(tokenId);
    const isTokenValid = token && isAfter(token.expiresAt, new Date());
    if (!isTokenValid) throw new UnauthorizedException();

    return token;
  }
}
