import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { OAuthTokenPayload } from 'src/oauth/interfaces';

export const GetCurrentClient = createParamDecorator<keyof OAuthTokenPayload>(
  (key, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const client = request.user as OAuthTokenPayload;
    return key ? client[key] : client;
  },
);
