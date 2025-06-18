"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { LexAiLogo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { LayoutDashboard, Briefcase, FileText, UserCircle, Settings, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { APP_NAME } from '@/lib/constants';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/workspaces', label: 'Workspaces', icon: Briefcase },
  // Document generation might be context-dependent (within a workspace)
  // { href: '/dashboard/generate', label: 'Generate Document', icon: FileText }, 
  { href: '/dashboard/profile', label: 'Profile', icon: UserCircle },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r">
      <SidebarHeader className="flex items-center justify-between p-4">
        <Link href="/dashboard" className="flex items-center gap-2" aria-label={`${APP_NAME} Home`}>
          <LexAiLogo className="h-7 w-auto" />
          <span className="font-headline text-xl font-semibold text-primary group-data-[collapsible=icon]:hidden">
            {APP_NAME}
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-grow p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
                tooltip={{ children: item.label, side: 'right', align: 'center' }}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        {/* Placeholder for potential future elements like theme toggle or quick settings */}
      </SidebarFooter>
    </Sidebar>
  );
}
