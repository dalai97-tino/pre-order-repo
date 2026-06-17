export interface AdminUser {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
}

const TOKEN_KEY = "preorder_admin_token";
const ADMIN_KEY = "preorder_admin_user";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function saveAdminSession(token: string, admin: AdminUser) {
  window.localStorage.setItem(TOKEN_KEY, token);
  window.localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
}

export function clearAdminSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(ADMIN_KEY);
}

export function getStoredAdmin(): AdminUser | null {
  if (typeof window === "undefined") return null;

  const stored = window.localStorage.getItem(ADMIN_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as AdminUser;
  } catch {
    clearAdminSession();
    return null;
  }
}

export function isAdminAuthenticated(): boolean {
  return Boolean(getAdminToken());
}
