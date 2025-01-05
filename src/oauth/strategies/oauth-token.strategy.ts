import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { OAuthTokenPayload } from '../interfaces';
import { ClientsService } from 'src/clients/clients.service';
import { JwtService } from '@nestjs/jwt';
import { OauthService } from '../oauth.service';

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
          const jwtPayload = this.jwtService.decode(token) as OAuthTokenPayload;
          const tokenId = jwtPayload.clientId;
          const clientSecret =
            await this.clientsService.getClientSecretByClientId(tokenId);

          await this.oauthService.validateAccessTokenByTokenId(
            jwtPayload.tokenId || '',
          );

          return done(null, clientSecret);
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
