export interface UserRole {
  id: number;
  name: string;
}

export interface UserProfile {
  id: number;
  login: string;
  password: string;
  email: string;
  isActive: boolean;
  roleId: number;
  createdAt: string;
  updatedAt: string;

  /* Relations */
  role: UserRole;
}
