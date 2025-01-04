import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { OAuthCodesModel } from './models/oauth-codes.model';
import { Repository } from 'sequelize-typescript';
import { ClientTokensModel } from './models/client-tokens.model';
import { ConsentsModel } from './models/consents.model';
import { AuthorizeDto, ExchangeAuthCodeDto } from './dto';
import { BadRequestException } from 'src/common/exceptions';
import { ACCESS_DENIED, CODE_CHALLENGE_METHOD_INCORRECT } from 'src/constants';
import { ClientsService } from 'src/clients/clients.service';
import { nanoid } from 'nanoid';
import { addMinutes } from 'date-fns';
import { AUTH_CODE_LENGTH, AUTH_CODE_TTL } from 'src/configs/oauth';
import crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { OAuthTokenPayload } from './interfaces';

@Injectable()
export class OauthService {
  constructor(
    /* Models */
    @InjectModel(OAuthCodesModel)
    private oauthCodesRepository: Repository<OAuthCodesModel>,
    @InjectModel(ClientTokensModel)
    private tokensRepository: Repository<ClientTokensModel>,
    @InjectModel(ConsentsModel)
    private consentsRepository: Repository<ConsentsModel>,

    /* Services */
    private readonly clientsService: ClientsService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async authorize(dto: AuthorizeDto, userId: number) {
    const {
      clientId,
      codeChallenge,
      codeChallengeMethod,
      redirectUri,
      scope,
      state,
    } = dto;

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

    await this.oauthCodesRepository.create({
      userId,
      clientId,
      codeChallenge,
      redirectUri: client.redirectUri,
      scope,
      state: state || null,
      code,
      expiresAt,
    });
    await this.consentsRepository.create({
      userId,
      clientId,
      scope,
    });

    console.log('CODE: ', code);
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

    this.validateCodeVerifier(codeVerifier, oauthCode.codeChallenge);
    await oauthCode.destroy();

    const tokensPayload: OAuthTokenPayload = {
      clientId,
      clientName: client.name,
      userId: oauthCode.userId,
      scope: oauthCode.scope,
    };
    const { access_token, refresh_token, type, ...tokensId } =
      await this.generateTokens(tokensPayload, client.clientSecret);

    const expiresAt = addMinutes(new Date(), 60);
    await this.tokensRepository.create({
      accessTokenId: tokensId.accessTokenId,
      refreshTokenId: tokensId.refreshTokenId,
      userId: tokensPayload.userId,
      clientId: tokensPayload.clientId,
      scope: tokensPayload.scope,
      expiresAt,
    });

    return { access_token, refresh_token, type, scope: tokensPayload.scope };
  }

  /* Internal */
  private validateCodeVerifier(codeVerifier: string, codeChallenge: string) {
    const hash = crypto.createHash('sha256');
    hash.update(codeVerifier);
    const hashedCodeVerifier = hash.digest('base64url');

    if (hashedCodeVerifier !== codeChallenge) {
      throw new BadRequestException('codeVerifier', ACCESS_DENIED);
    }
  }

  private async generateTokens(payload: OAuthTokenPayload, secret: string) {
    const refreshTokenId = nanoid();
    const accessTokenId = nanoid();
    const type = 'Bearer';

    const access_token = await this.generateAccessToken(
      { ...payload, tokenId: accessTokenId },
      secret,
    );
    const refresh_token = await this.generateRefreshToken(
      { ...payload, tokenId: refreshTokenId },
      secret,
    );

    return { type, access_token, refresh_token, accessTokenId, refreshTokenId };
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
}
