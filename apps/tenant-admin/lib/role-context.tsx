'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

/**
 * Tenant Admin portal RBAC.
 *
 * Architecture mirrors the super-admin portal but scoped to a single tenant:
 *
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  TenantRole (4 built-ins)                                           │
 *   │   tenant_admin │ manager │ agent │ viewer                           │
 *   │                                                                     │
 *   │  Capability  ── enum of every gated action / nav item               │
 *   │  PERMISSIONS ── role → capabilities[]                               │
 *   │  can(cap)    ── runtime check, used by sidebar filter + page guards │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 * Source of truth for the dev role-switcher is `localStorage`. In production
 * the role would come from the user's session/JWT.
 */

export type TenantRole = 'tenant_admin' | 'manager' | 'agent' | 'viewer';

export interface TenantUser {
  id:       string;
  name:     string;
  email:    string;
  initials: string;
  role:     TenantRole;
  /** Which group / team this person belongs to (for managers + agents) */
  group?:   string;
  accent:   'red' | 'coral' | 'blue' | 'slate';
}

// ─── Capabilities (alphabetical within each section) ─────────────────────────

export type Capability =
  // — Overview
  | 'view_dashboard'
  | 'view_audit_log'
  // — Workspace settings
  | 'view_settings'        | 'manage_settings'
  | 'view_branding'        | 'manage_branding'
  | 'view_business_hours'  | 'manage_business_hours'
  | 'view_migration'       | 'run_migration'
  // — Ticketing
  | 'view_sla'             | 'manage_sla'
  | 'view_automations'     | 'manage_automations'
  | 'view_ticket_fields'   | 'manage_ticket_fields'
  // — People
  | 'view_agents'          | 'manage_agents'  | 'create_agents'
  | 'view_roles'           | 'manage_roles'
  // — Connect
  | 'view_channels'        | 'manage_channels'
  | 'view_integrations'    | 'manage_integrations'
  // — Master action flag — false for read-only viewers
  | 'perform_actions';

// ─── Role → capability matrix ────────────────────────────────────────────────

const PERMISSIONS: Record<TenantRole, Capability[]> = {
  tenant_admin: [
    // Full control across the tenant
    'view_dashboard', 'view_audit_log',
    'view_settings', 'manage_settings',
    'view_branding', 'manage_branding',
    'view_business_hours', 'manage_business_hours',
    'view_migration', 'run_migration',
    'view_sla', 'manage_sla',
    'view_automations', 'manage_automations',
    'view_ticket_fields', 'manage_ticket_fields',
    'view_agents', 'manage_agents', 'create_agents',
    'view_roles', 'manage_roles',
    'view_channels', 'manage_channels',
    'view_integrations', 'manage_integrations',
    'perform_actions',
  ],
  manager: [
    // Group lead — manages people + day-to-day ticketing config, can't touch
    // tenant-wide config (branding, settings, migration, billing).
    'view_dashboard', 'view_audit_log',
    'view_settings',                       // read-only tenant settings
    'view_branding',
    'view_business_hours',
    'view_sla', 'manage_sla',
    'view_automations', 'manage_automations',
    'view_ticket_fields', 'manage_ticket_fields',
    'view_agents', 'manage_agents',        // can edit agents (own group), but not create
    'view_roles',                          // read-only roles
    'view_channels',
    'view_integrations',
    'perform_actions',
  ],
  agent: [
    // Frontline support — sees only what they need to do their job.
    'view_dashboard',
    'view_sla',                            // can read SLA targets they're held to
    'view_automations',
    'view_ticket_fields',
    'view_agents',                         // can see the team list
    'view_channels',
    'perform_actions',
  ],
  viewer: [
    // Auditor / observer — read-everything, mutate-nothing.
    'view_dashboard', 'view_audit_log',
    'view_settings', 'view_branding', 'view_business_hours',
    'view_sla', 'view_automations', 'view_ticket_fields',
    'view_agents', 'view_roles',
    'view_channels', 'view_integrations',
    // Deliberately NO 'perform_actions' — UI buttons disabled across the app.
  ],
};

// ─── Personas for the dev role-switcher ──────────────────────────────────────

const ROLE_PRESETS: Record<TenantRole, TenantUser> = {
  tenant_admin: { id: 't-do', name: 'Daniel Oshinubi', email: 'daniel@consomoafrica.com', initials: 'DO', role: 'tenant_admin', accent: 'red' },
  manager:      { id: 't-am', name: 'Amara Diallo',    email: 'amara@consomoafrica.com',  initials: 'AD', role: 'manager',      accent: 'coral', group: 'Tier 1 Support' },
  agent:        { id: 't-tb', name: 'Tunde Bakare',    email: 'tunde@consomoafrica.com',  initials: 'TB', role: 'agent',        accent: 'blue',  group: 'Tier 1 Support' },
  viewer:       { id: 't-fs', name: 'Fatima Suleiman', email: 'fatima@consomoafrica.com', initials: 'FS', role: 'viewer',       accent: 'slate' },
};

const DEFAULT_USER: TenantUser = ROLE_PRESETS.tenant_admin;

// ─── Friendly metadata exported for use in the agent-creation flow ──────────

export interface RoleMeta {
  id:          TenantRole;
  label:       string;
  description: string;
  /** Tailwind-safe tone classes for badges/avatars */
  tone:        { bg: string; text: string; ring: string };
}

export const ROLE_META: Record<TenantRole, RoleMeta> = {
  tenant_admin: {
    id: 'tenant_admin',
    label: 'Tenant admin',
    description: 'Full control over tenant configuration, agents, SLA, branding, integrations and billing view.',
    tone: { bg: 'bg-red-100',     text: 'text-red-700',     ring: 'ring-red-300' },
  },
  manager: {
    id: 'manager',
    label: 'Manager',
    description: 'Group lead — edits SLA, automations, ticket fields and manages their own team of agents.',
    tone: { bg: 'bg-coral/15',    text: 'text-coral-dark',  ring: 'ring-coral/40' },
  },
  agent: {
    id: 'agent',
    label: 'Agent',
    description: 'Frontline support — handles tickets, reads SLA targets, sees the agent workspace.',
    tone: { bg: 'bg-blue-100',    text: 'text-blue-700',    ring: 'ring-blue-300' },
  },
  viewer: {
    id: 'viewer',
    label: 'Viewer',
    description: 'Read-only — observes dashboards, reports and configuration without making changes.',
    tone: { bg: 'bg-slate-100',   text: 'text-slate-700',   ring: 'ring-slate-300' },
  },
};

// ─── Provider ────────────────────────────────────────────────────────────────

interface RoleContextValue {
  user:    TenantUser;
  setRole: (role: TenantRole) => void;
  can:     (capability: Capability) => boolean;
  signOut: () => void;
}

const RoleContext = createContext<RoleContextValue | null>(null);
const STORAGE_KEY = 'topiadesk.tenant-admin.role';

export function RoleProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TenantUser>(DEFAULT_USER);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate role from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY) as TenantRole | null;
    if (stored && ROLE_PRESETS[stored]) {
      setUser(ROLE_PRESETS[stored]);
    }
    setHydrated(true);
  }, []);

  const setRole = (role: TenantRole) => {
    const next = ROLE_PRESETS[role];
    setUser(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, role);
    }
  };

  const can = (capability: Capability) =>
    PERMISSIONS[user.role].includes(capability);

  const signOut = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
      window.location.href = '/login';
    }
  };

  // Avoid SSR hydration mismatch — render children only after we know the role.
  if (!hydrated) return <>{children}</>;

  return (
    <RoleContext.Provider value={{ user, setRole, can, signOut }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) {
    // SSR / pre-mount fallback — assume tenant_admin so we never under-render.
    return {
      user:    DEFAULT_USER,
      setRole: () => {},
      can:     (c: Capability) => PERMISSIONS.tenant_admin.includes(c),
      signOut: () => {},
    };
  }
  return ctx;
}

/** Expose the role list (for the create-agent picker, the roles page, etc.) */
export const TENANT_ROLES: TenantRole[] = ['tenant_admin', 'manager', 'agent', 'viewer'];
