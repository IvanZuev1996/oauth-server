import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { OAuthTokenPayload } from 'src/oauth/interfaces';

export const GetCurrentOauthUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const client = request.user as OAuthTokenPayload;
    return client.userId;
  },
);
