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
  RESPONSE_TYPE_INCORRECT,
} from 'src/constants';
import { ClientsService } from 'src/clients/clients.service';
import { nanoid } from 'nanoid';
import { addMinutes, addSeconds, isAfter } from 'date-fns';
import { AUTH_CODE_LENGTH, AUTH_CODE_TTL } from 'src/configs/oauth';
import crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import {
  CreateAuthCodeAttributes,
  CreateConsentAttributes,
  CreateOAuthTokensAttributes,
  DecodedOAuthTokenPayload,
  OAuthTokenPayload,
} from './interfaces';
import { ScopesService } from 'src/scopes/scopes.service';

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
    private readonly scopesService: ScopesService,
    private jwtService: JwtService,
  ) {}

  async authorize(dto: AuthorizeDto, userId: number) {
    const {
      client_id,
      redirect_uri,
      code_challenge_method,
      code_challenge,
      response_type,
      scope,
      state,
    } = dto;
    const client = await this.clientsService.getClientByClientId(client_id);

    if (code_challenge_method !== 'S256') {
      throw new BadRequestException(
        'codeChallengeMethod',
        CODE_CHALLENGE_METHOD_INCORRECT,
      );
    }

    if (response_type !== 'code') {
      throw new BadRequestException('responseType', RESPONSE_TYPE_INCORRECT);
    }

    if (redirect_uri && redirect_uri !== client.redirectUri) {
      throw new BadRequestException('redirectUri', ACCESS_DENIED);
    }

    const expiresAt = addMinutes(new Date(), AUTH_CODE_TTL);
    const code = nanoid(AUTH_CODE_LENGTH);
    const scopes = scope || client.scopes.join(' ');

    await this.saveAuthCode({
      code,
      userId,
      expiresAt,
      scope: scopes,
      clientId: client_id,
      codeChallenge: code_challenge,
      state: state || null,
      redirectUri: client.redirectUri,
    });
    await this.saveConsent({ userId, clientId: client_id, scope: scopes });

    let url = `${client.redirectUri}?code=${code}`;
    if (state) url += '&state=' + state;

    return { url };
  }

  async exchangeAuthCode(dto: ExchangeAuthCodeDto) {
    const { client_id, code, code_verifier } = dto;

    const client = await this.clientsService.getClientByClientId(client_id);
    const oauthCode = await this.oauthCodesRepository.findOne({
      where: { code, clientId: client_id },
    });
    if (!oauthCode) throw new BadRequestException('code', ACCESS_DENIED);

    const isOauthCodeValid = isAfter(oauthCode.expiresAt, new Date());
    if (!isOauthCodeValid) {
      throw new BadRequestException('code', OAUTH_CODE_EXPIRED);
    }

    // TODO:
    // this.validateCodeVerifier(code_verifier, oauthCode.codeChallenge);
    const activeToken = await this.getTokenByClientId(client_id);
    if (activeToken) await activeToken.destroy();
    await oauthCode.destroy();

    const tokensPayload: OAuthTokenPayload = {
      clientId: client_id,
      clientName: client.name,
      userId: oauthCode.userId,
      scope: oauthCode.scope,
      tokenId: '',
    };

    const ttl = await this.calculateScopeTTL(tokensPayload.scope);
    const { access_token, refresh_token, type, refreshTokenId } =
      await this.generateTokens(tokensPayload, client.clientSecret, ttl);

    await this.saveToken({ ...tokensPayload, tokenId: refreshTokenId }, ttl);

    return { access_token, refresh_token, type, scope: tokensPayload.scope };
  }

  async refreshOAuthToken(dto: RefreshOAuthTokenDto, clientId: string) {
    const client = await this.clientsService.getClientByClientId(clientId);
    const tokenPayload = await this.verifyClientByRefreshToken(
      dto.refresh_token,
      client.clientSecret,
    );
    if (!tokenPayload) throw new UnauthorizedException();

    const activeToken = await this.getTokenByTokenId(tokenPayload.tokenId);
    if (!activeToken) throw new UnauthorizedException();

    await activeToken.destroy();

    const { access_token, refresh_token, type, refreshTokenId } =
      await this.generateTokens(
        tokenPayload,
        client.clientSecret,
        tokenPayload.exp,
      );

    await this.saveToken(
      { ...tokenPayload, tokenId: refreshTokenId },
      tokenPayload.exp,
    );

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

  private async saveToken(payload: CreateOAuthTokensAttributes, ttl: number) {
    const expiresAt = addSeconds(new Date(), ttl);

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

  private async calculateScopeTTL(scope: string) {
    const scopeKeys = scope.split(' ');
    const scopes = await this.scopesService.getScopesByKeys(scopeKeys);
    if (!scopes || !scopes.length) return -1;

    let ttl = -1;
    for await (const scope of scopes) {
      if (ttl === -1) {
        ttl = scope.ttl;
        continue;
      }
      ttl = Math.min(ttl, scope.ttl);
    }
    return ttl;
  }

  private async generateTokens(
    payload: OAuthTokenPayload,
    secret: string,
    ttl: number,
  ) {
    const refreshTokenId = nanoid();
    const type = 'Bearer';

    const access_token = await this.generateAccessToken(
      { ...payload, tokenId: refreshTokenId },
      secret,
      ttl,
    );
    const refresh_token = await this.generateRefreshToken(
      { ...payload, tokenId: refreshTokenId },
      secret,
      ttl,
    );

    return { type, access_token, refresh_token, refreshTokenId };
  }

  private async generateAccessToken(
    payload: OAuthTokenPayload,
    secret: string,
    ttl: number,
  ) {
    const options = { secret, expiresIn: ttl };
    return await this.jwtService.signAsync(payload, options);
  }

  private async generateRefreshToken(
    payload: OAuthTokenPayload,
    secret: string,
    ttl: number,
  ) {
    const options = { secret, expiresIn: ttl };
    return await this.jwtService.signAsync(payload, options);
  }

  private async verifyClientByRefreshToken(
    oldRefreshToken: string,
    secret: string,
  ) {
    try {
      const payload = this.jwtService.verify<DecodedOAuthTokenPayload>(
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

  async validateRefreshTokenByTokenId(tokenId: string) {
    const token = await this.getTokenByTokenId(tokenId);
    const isTokenValid = token && isAfter(token.expiresAt, new Date());
    if (!isTokenValid) throw new UnauthorizedException();
    return token;
  }
}
