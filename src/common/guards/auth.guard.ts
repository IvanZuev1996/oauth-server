import { HttpService } from '@nestjs/axios';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { PUBLIC_METADATA } from 'src/constants';
import { ExternalUserProfile } from 'src/users/interfaces';
import { UnauthorizedException } from '../exceptions';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(PUBLIC_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;
    const authProviderURL = this.configService.get('R_PROFILE_URL');

    try {
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) throw new UnauthorizedException();

      const url = `${authProviderURL}/users/get-me`;
      const headers = { Authorization: `Bearer ${token}` };
      const { data } = await firstValueFrom(
        this.httpService.get<ExternalUserProfile>(url, { headers }).pipe(
          catchError((error: AxiosError) => {
            throw 'Unauthorized!';
          }),
        ),
      );
      request.user = { ...data };
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
