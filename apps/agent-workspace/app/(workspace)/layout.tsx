import type { ReactNode } from 'react';
import { Shell } from '../_components/shell';

export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <Shell>{children}</Shell>;
}
