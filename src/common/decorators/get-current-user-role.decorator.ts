import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { AccessToken } from 'src/auth/interfaces';
import { UserRole } from 'src/users/interfaces';

export const GetCurrentUserRole = createParamDecorator(
  (_: undefined, context: ExecutionContext): UserRole => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AccessToken;
    return user.role;
  },
);
