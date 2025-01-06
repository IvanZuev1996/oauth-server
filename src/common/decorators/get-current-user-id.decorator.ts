import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { AccessToken } from 'src/auth/interfaces';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as AccessToken;
    return user.userId;
  },
);
