import { RolesEnum } from 'src/configs/roles';

export interface UserRole {
  id: number;
  name: RolesEnum;
}

export interface UserProfile {
  id: number;
  login: string;
  password: string;
  email: string;
  telegram: string;
  isActive: boolean;
  roleId: number;
  name: string;
  createdAt: string;
  updatedAt: string;

  /* Relations */
  role?: UserRole;
}
