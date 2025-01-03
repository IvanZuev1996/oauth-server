import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserProfile } from 'src/users/interfaces';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as UserProfile;
    return user.id;
  },
);
