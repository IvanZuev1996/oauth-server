import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserProfile, UserRole } from 'src/users/interfaces';

export const GetCurrentUserRole = createParamDecorator(
  (_: undefined, context: ExecutionContext): UserRole => {
    const request = context.switchToHttp().getRequest();
    const user = request.localProfile as UserProfile;
    return user.role;
  },
);
