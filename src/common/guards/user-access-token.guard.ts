import { ExecutionContext, Injectable } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { OAUTH_METADATA, PUBLIC_METADATA } from 'src/constants';

@Injectable()
export class UserAccessTokenGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(PUBLIC_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isOauth = this.reflector.getAllAndOverride(OAUTH_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic || isOauth) return true;

    return super.canActivate(context);
  }
}
