import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { OAuthTokenPayload } from 'src/oauth/interfaces';

export const GetCurrentClientId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest();
    const client = request.user as OAuthTokenPayload;
    return client.clientId;
  },
);
