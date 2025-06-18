"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { AppHeader } from './app-header';
import { AppSidebar } from './app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar'; 
import { Skeleton } from '@/components/ui/skeleton';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    );
  }

  if (!user) {
    // This case should ideally not be reached due to the redirect,
    // but it's a fallback or for the brief moment before redirect.
    return null; 
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <AppSidebar />
        <div className="flex flex-col sm:gap-4 sm:py-0 sm:pl-14 md:pl-0 group-data-[collapsible=icon]:md:pl-14 group-data-[collapsible=offcanvas]:md:pl-0 transition-all duration-200 ease-linear">
           {/* The sm:pl-14 (sidebar icon width + padding) should be adjusted based on actual sidebar width when collapsed */}
          <AppHeader />
          <main className="flex-1 p-4 sm:px-6 sm:py-0 md:gap-8 bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
