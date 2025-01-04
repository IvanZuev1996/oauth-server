import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { OAuthTokenPayload } from '../interfaces';
import { ClientsService } from 'src/clients/clients.service';

@Injectable()
export class OAuthAccessTokenStrategy extends PassportStrategy(
  Strategy,
  'oauth-jwt',
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly clientsService: ClientsService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'fewfew',
    });
  }

  validate(payload: OAuthTokenPayload) {
    return payload;
  }
}
