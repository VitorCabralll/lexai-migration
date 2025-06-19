import { AuthLayout } from '@/components/layout/auth-layout';
import type { ReactNode } from 'react';
import { WorkspaceProvider } from '@/contexts/WorkspaceContext';
import { OnboardingTourProvider } from '@/contexts/OnboardingTourContext';

function Providers({ children }: { children: ReactNode }) {
  "use client";
  return (
    <WorkspaceProvider>
      <OnboardingTourProvider>{children}</OnboardingTourProvider>
    </WorkspaceProvider>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <AuthLayout>{children}</AuthLayout>
    </Providers>
  );
}
