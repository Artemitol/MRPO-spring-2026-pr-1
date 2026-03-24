export type UserRole = 'guest' | 'client' | 'manager' | 'admin';

export interface AuthUser {
  id: number;
  fullName: string;
  role: UserRole;
}
