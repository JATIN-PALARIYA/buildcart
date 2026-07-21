export interface AdminUser {
  id?: string;
  name: string;
  email: string;
  role: string;
}

export interface BackendAdminUser {
  id?: string;
  name: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  admin: AdminUser;
}
