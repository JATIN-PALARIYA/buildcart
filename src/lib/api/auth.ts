import { AdminUser, LoginResponse } from "../types/auth";

const API_BASE_URL = "/api";

/**
 * Log in to the admin portal.
 * // TODO: Authentication handled by backend
 */
export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to log in");
  }
  return await response.json();
}

/**
 * Log out of the admin portal.
 */
export async function logout(): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/logout`, {
    method: "POST",
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to log out");
  }
}

/**
 * Update the profile information.
 */
export async function updateProfile(
  name: string,
  email: string
): Promise<AdminUser> {
  const response = await fetch(`${API_BASE_URL}/admin/profile`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email })
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update profile");
  }
  const data = await response.json();
  return data.admin;
}

/**
 * Update password security credentials.
 */
export async function updatePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/admin/profile/password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message || "Failed to update password");
  }
}
