export interface AdminUser {
  id: string;
  name: string;
  email: string;
}

export interface AdminAuthResponse {
  user: AdminUser;
  token: string;
  refreshToken: string;
  expiresIn: number;
} 