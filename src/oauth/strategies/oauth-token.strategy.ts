import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { DecodedOAuthTokenPayload, OAuthTokenPayload } from '../interfaces';
import { ClientsService } from 'src/clients/clients.service';
import { JwtService } from '@nestjs/jwt';
import { OauthService } from '../oauth.service';
import { ClientStatus } from 'src/clients/interfaces';
import { UnauthorizedException } from 'src/common/exceptions';

@Injectable()
export class OAuthAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'oauth-jwt',
) {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly oauthService: OauthService,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKeyProvider: async (
        _: any,
        token: string,
        done: (...args: any[]) => void,
      ) => {
        try {
          const jwtPayload: DecodedOAuthTokenPayload =
            this.jwtService.decode(token);

          const clientId = jwtPayload.tokenId;
          await this.oauthService.validateRefreshTokenByTokenId(
            jwtPayload.tokenId,
          );

          const client =
            await this.clientsService.getClientByClientId(clientId);
          if (client.status !== ClientStatus.ACTIVE) {
            throw new UnauthorizedException();
          }

          return done(null, client.clientSecret);
        } catch (error) {
          return done(error, null);
        }
      },
    });
  }

  async validate(payload: OAuthTokenPayload) {
    return payload;
  }
}
