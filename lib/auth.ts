import { UserRole } from '@/types';

export const DEMO_USERS: Record<string, { role: UserRole; name: string }> = {
  'admin-token': { role: 'admin', name: 'Admin User' },
  'analyst-token': { role: 'analyst', name: 'Jane Analyst' },
  'viewer-token': { role: 'viewer', name: 'Bob Viewer' },
};

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['view_reports', 'view_drafts', 'download_reports', 'manage_users'],
  analyst: ['view_reports', 'view_drafts', 'download_reports'],
  viewer: ['view_reports'],
};

export function hasPermission(role: UserRole, permission: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function getRoleFromToken(token: string | null): UserRole | null {
  if (!token) return null;
  return DEMO_USERS[token]?.role ?? null;
}

export function getUserFromToken(token: string | null) {
  if (!token) return null;
  return DEMO_USERS[token] ?? null;
}
