import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CacheService } from 'src/cache/cache.service';
import { ACCESS_DENIED, OAUTH_METADATA, SCOPES_METADATA } from 'src/constants';
import { ScopesValidator } from './scope-validator';
import { ClientsService } from 'src/clients/clients.service';

@Injectable()
export class ScopesGuard implements CanActivate {
  private readonly scopesValidator: ScopesValidator;

  constructor(
    private reflector: Reflector,
    private readonly cacheService: CacheService,
    private readonly clientsService: ClientsService,
  ) {
    this.scopesValidator = new ScopesValidator(this.cacheService);
  }

  matchScopes(requiredScopes: string[], clientScopes: string[]) {
    const isClientHasRequiredScopes = requiredScopes.every((scope) =>
      clientScopes.includes(scope),
    );
    if (!isClientHasRequiredScopes) {
      throw new ForbiddenException({ message: ACCESS_DENIED });
    }
    return true;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
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
    const clientId = request.user?.clientId || '';

    const clientScopeStr: string = request.user?.scope || '';
    const clientScopes = clientScopeStr.split(' ') || [];

    /* Check if client has required scopes for the route */
    const isScopesMatched = this.matchScopes(requiredScopes, clientScopes);
    if (isScopesMatched) return true;

    const client = await this.clientsService.getClientByClientId(clientId);
    if (!client) throw new ForbiddenException({ message: ACCESS_DENIED });

    /* Check scopes options for the client */
    await this.scopesValidator.validate({
      clientId,
      options: client.scopesOptions,
      clientScopes,
      request,
    });

    return true;
  }
}
