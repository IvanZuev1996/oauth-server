import { UserProfile, UserRole } from 'src/users/interfaces';

export interface TokensCreationAttributes {
  tokenId: string;
  userId: number;
}
export interface AccessToken extends Pick<UserProfile, 'login'> {
  userId: number;
  role: UserRole;
}

export interface RefreshToken extends AccessToken {
  tokenId: string;
}

export interface TokensPayload extends AccessToken {}
