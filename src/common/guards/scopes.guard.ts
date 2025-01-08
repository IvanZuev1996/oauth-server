import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ACCESS_DENIED, OAUTH_METADATA, SCOPES_METADATA } from 'src/constants';

@Injectable()
export class ScopesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  matchScopes(requiredScopes: string[], clientScopes: string[]) {
    const isClientHasRequiredScopes = requiredScopes.every((scope) =>
      clientScopes.includes(scope),
    );
    if (!isClientHasRequiredScopes) {
      throw new ForbiddenException({ message: ACCESS_DENIED });
    }
    return true;
  }

  canActivate(context: ExecutionContext): boolean {
    const isOauth = this.reflector.getAllAndOverride(OAUTH_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!isOauth) return true;

    const requiredScopes = this.reflector.getAllAndOverride<string[]>(
      SCOPES_METADATA,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredScopes) return true;

    const request = context.switchToHttp().getRequest();
    const clientScopeStr: string = request.user?.scope || '';
    const clientScopes = clientScopeStr.split(' ') || [];

    return this.matchScopes(requiredScopes, clientScopes);
  }
}
