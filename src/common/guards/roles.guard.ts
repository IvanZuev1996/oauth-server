import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ACCESS_DENIED, ROLES_METADATA } from 'src/constants';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  matchRoles(roles: string[], userRole: string) {
    if (roles.some((role) => role === userRole)) {
      return true;
    }

    throw new ForbiddenException({ message: ACCESS_DENIED });
  }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) return true;
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return this.matchRoles(roles, user.role);
  }
}
