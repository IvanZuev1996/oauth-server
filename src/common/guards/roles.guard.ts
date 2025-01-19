import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokensPayload } from 'src/auth/interfaces';
import { ACCESS_DENIED, ROLES_METADATA } from 'src/constants';
import { RoleModel } from 'src/roles/models/role.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  matchRoles(roles: string[], userRole: string) {
    if (roles.some((role) => role === userRole)) {
      return true;
    }

    throw new ForbiddenException({ message: ACCESS_DENIED });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles) return true;
    const request = context.switchToHttp().getRequest();
    const user = request.user as TokensPayload;

    const userData = await this.usersService.getUserById(user.userId, {
      model: RoleModel,
    });

    if (!userData) {
      throw new ForbiddenException({ message: ACCESS_DENIED });
    }

    return this.matchRoles(roles, userData.role.name);
  }
}
