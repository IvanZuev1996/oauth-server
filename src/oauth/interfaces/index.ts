export interface OAuthTokenPayload {
  clientId: string;
  clientName: string;
  scope: number[];
  userId: number;
  tokenId?: string;
}
