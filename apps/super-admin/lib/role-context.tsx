'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

/**
 * Roles for the Topiadesk super-admin portal. Each role exposes a different
 * set of navigation items and capabilities.
 *
 * In production this would come from the user's JWT / session.
 * For now we use localStorage so role-switching during dev is one click.
 */
export type AdminRole = 'super_admin' | 'admin' | 'csr' | 'viewer';

export interface CurrentUser {
  id:        string;
  name:      string;
  email:     string;
  initials:  string;
  role:      AdminRole;
  /** Avatar accent (matches user's role colour) */
  accent:    'red' | 'coral' | 'blue' | 'slate';
}

const DEFAULT_USER: CurrentUser = {
  id:       'u-do',
  name:     'Daniel Oshinubi',
  email:    'daniel@topiadesk.com',
  initials: 'DO',
  role:     'super_admin',
  accent:   'red',
};

interface RoleContextValue {
  user: CurrentUser;
  setRole: (role: AdminRole) => void;
  can: (capability: Capability) => boolean;
  signOut: () => void;
}

const RoleContext = createContext<RoleContextValue | null>(null);

// ─── Capabilities ────────────────────────────────────────────────────────────
// Each capability maps to a route group / module. The matrix below decides
// what each role can see and do.

export type Capability =
  | 'view_dashboard'
  | 'view_notifications'
  | 'manage_tenants'
  | 'view_tenants'
  | 'manage_users'
  | 'view_users'                // read-only users
  | 'create_admins'
  | 'handle_support'            // can edit/reply on tickets
  | 'view_support'              // read-only access to support queue
  | 'view_billing'
  | 'manage_billing'
  | 'manage_plans'
  | 'view_plans'                // read-only plans
  | 'manage_feature_flags'
  | 'manage_announcements'
  | 'view_analytics'            // platform-wide insights
  | 'view_integrations'         // third-party services
  | 'manage_integrations'
  | 'view_email_templates'
  | 'manage_email_templates'
  | 'view_api_keys'
  | 'manage_api_keys'
  | 'view_compliance'
  | 'manage_compliance'
  | 'view_system'
  | 'view_audit_logs'
  | 'view_security'             // read-only security events
  | 'manage_security'
  | 'view_roles'                // RBAC role management
  | 'manage_roles'
  | 'view_status_page'          // public status page editor
  | 'manage_status_page'
  | 'view_knowledge_base'       // help articles CMS
  | 'manage_knowledge_base'
  | 'view_changelog'            // product release notes
  | 'manage_changelog'
  | 'view_backups'              // backup & DR
  | 'manage_backups'
  | 'view_tenant_onboarding'    // onboarding flow editor
  | 'manage_tenant_onboarding'
  | 'edit_settings'
  | 'perform_actions';          // master "can do anything that mutates" flag — false for Viewer

const PERMISSIONS: Record<AdminRole, Capability[]> = {
  super_admin: [
    'view_dashboard','view_notifications','manage_tenants','view_tenants','manage_users','view_users','create_admins',
    'handle_support','view_support','view_billing','manage_billing','manage_plans','view_plans','manage_feature_flags','manage_announcements',
    'view_analytics','view_integrations','manage_integrations','view_email_templates','manage_email_templates','view_api_keys','manage_api_keys',
    'view_compliance','manage_compliance',
    'view_system','view_audit_logs','view_security','manage_security',
    'view_roles','manage_roles','view_status_page','manage_status_page',
    'view_knowledge_base','manage_knowledge_base','view_changelog','manage_changelog',
    'view_backups','manage_backups','view_tenant_onboarding','manage_tenant_onboarding',
    'edit_settings','perform_actions',
  ],
  admin: [
    'view_dashboard','view_notifications','manage_tenants','view_tenants','view_users',          // users read-only
    'handle_support','view_support',
    'view_billing','view_plans',                                                                  // billing & plans read-only
    'view_analytics','view_integrations','view_email_templates','view_api_keys',
    'view_system','view_audit_logs','view_security',                                              // security read-only
    'view_roles','view_status_page','manage_status_page','view_knowledge_base','manage_knowledge_base',
    'view_changelog','manage_changelog','view_backups','view_tenant_onboarding',
    'perform_actions',
  ],
  csr: [
    'view_dashboard','view_notifications','view_tenants',
    'handle_support','view_support',
    'view_knowledge_base',                   // CSRs read help articles to assist customers
    'perform_actions',
  ],
  viewer: [
    'view_dashboard','view_notifications','view_tenants',
    'view_support',                          // support read-only (no handle_support)
    'view_billing','view_plans',
    'view_analytics',
    'view_system','view_audit_logs','view_security',
    'view_roles','view_status_page','view_knowledge_base','view_changelog','view_backups','view_tenant_onboarding',
    // No 'perform_actions' — strict read-only across the board.
  ],
};

const ROLE_PRESETS: Record<AdminRole, CurrentUser> = {
  super_admin: { id: 'u-do',  name: 'Daniel Oshinubi', email: 'daniel@topiadesk.com',  initials: 'DO', role: 'super_admin', accent: 'red' },
  admin:       { id: 'u-am',  name: 'Amara Diallo',    email: 'amara@topiadesk.com',   initials: 'AD', role: 'admin',       accent: 'coral' },
  csr:         { id: 'u-tb',  name: 'Tunde Bakare',    email: 'tunde@topiadesk.com',   initials: 'TB', role: 'csr',         accent: 'blue' },
  viewer:      { id: 'u-fs',  name: 'Fatima Suleiman', email: 'fatima@topiadesk.com',  initials: 'FS', role: 'viewer',      accent: 'slate' },
};

// ─── Provider ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'topiadesk.super-admin.role';

export function RoleProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser>(DEFAULT_USER);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate role from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY) as AdminRole | null;
    if (stored && ROLE_PRESETS[stored]) {
      setUser(ROLE_PRESETS[stored]);
    }
    setHydrated(true);
  }, []);

  const setRole = (role: AdminRole) => {
    const next = ROLE_PRESETS[role];
    setUser(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, role);
    }
  };

  const can = (capability: Capability) => PERMISSIONS[user.role].includes(capability);

  const signOut = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
      window.location.href = '/login';
    }
  };

  // Don't render children until hydrated to avoid mismatch
  if (!hydrated) {
    return <>{children}</>;
  }

  return (
    <RoleContext.Provider value={{ user, setRole, can, signOut }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) {
    // Default to super_admin during render before provider mounts (SSR safety).
    return {
      user: DEFAULT_USER,
      setRole: () => {},
      can: (c: Capability) => PERMISSIONS.super_admin.includes(c),
      signOut: () => {},
    } as RoleContextValue;
  }
  return ctx;
}
