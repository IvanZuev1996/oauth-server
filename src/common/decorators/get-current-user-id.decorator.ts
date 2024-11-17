import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { ExternalUserProfile } from 'src/users/interfaces';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as ExternalUserProfile;
    return user.id;
  },
);
