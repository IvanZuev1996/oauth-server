export interface OAuthTokenPayload {
  clientId: string;
  clientName: string;
  scope: string;
  userId: number;
  tokenId: string;
}

export interface DecodedOAuthTokenPayload extends OAuthTokenPayload {
  exp: number;
  iat: number;
}

export interface CreateOAuthTokensAttributes extends OAuthTokenPayload {
  tokenId: string;
}

export interface CreateConsentAttributes
  extends Pick<OAuthTokenPayload, 'clientId' | 'userId' | 'scope'> {}

export interface CreateAuthCodeAttributes
  extends Omit<OAuthTokenPayload, 'clientName' | 'tokenId'> {
  codeChallenge: string;
  redirectUri: string;
  state: string;
  code: string;
  expiresAt: Date;
}
