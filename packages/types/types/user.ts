export enum UserRole {
  ADMIN = 0,
  USER = 1,
}

export interface UserJwtPayload {
  email: string;
  role: UserRole;
  id: number;
  refresh: boolean;
}
