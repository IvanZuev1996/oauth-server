import { RolesEnum } from 'src/configs/roles';
import { UserProfile } from 'src/users/interfaces';

export interface TokensCreationAttributes {
  token_id: string;
  user_id: number;
}
export interface AccessToken extends Pick<UserProfile, 'login'> {
  user_id: number;
  role: RolesEnum;
}

export interface RefreshToken extends AccessToken {
  token_id: string;
}

export interface TokensPayload extends AccessToken {}
