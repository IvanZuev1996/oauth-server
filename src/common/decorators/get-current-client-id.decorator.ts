import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { OAuthTokenPayload } from 'src/oauth/interfaces';

export const Test = createParamDecorator(
  (_: undefined, context: ExecutionContext) => {
    // const request = context.switchToHttp().getRequest();
    // const client = request.body as OAuthTokenPayload;
    return 'Привет';
  },
);
