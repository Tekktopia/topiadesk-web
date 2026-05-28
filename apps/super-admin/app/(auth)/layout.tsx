import type { ReactNode } from 'react';

/**
 * Auth layout for super-admin — no sidebar, no topbar. Just the canvas with
 * the login form centered.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      {children}
    </div>
  );
}
