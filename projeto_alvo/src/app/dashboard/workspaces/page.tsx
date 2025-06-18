"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WorkspaceCard } from '@/components/dashboard/workspace-card';
import type { Workspace } from '@/types';
import { PlusCircle, Search, ListFilter } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock data for workspaces
const MOCK_WORKSPACES: Workspace[] = [
  { id: 'ws1', name: 'Alpha Corp Merger', description: 'Documents related to the acquisition of Beta Inc. by Alpha Corp.', ownerId: 'mock-user-id', createdAt: new Date('2023-01-15'), updatedAt: new Date('2023-01-20') },
  { id: 'ws2', name: 'Patent Application - AI Tool', description: 'Drafting and filing patent for new AI discovery tool.', ownerId: 'mock-user-id', createdAt: new Date('2023-03-01'), updatedAt: new Date('2023-03-10') },
  { id: 'ws3', name: 'Real Estate Lease - SF Office', description: 'Negotiation and finalization of office lease agreement in San Francisco.', ownerId: 'mock-user-id', createdAt: new Date('2023-05-20'), updatedAt: new Date('2023-06-01') },
  { id: 'ws4', name: 'Client Onboarding - LexTech', ownerId: 'mock-user-id', createdAt: new Date('2023-07-10'), updatedAt: new Date('2023-07-12') },
];

export default function WorkspacesPage() {
  const { user, loading: authLoading } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!authLoading && user) {
      // Simulate fetching workspaces
      setTimeout(() => {
        setWorkspaces(MOCK_WORKSPACES.filter(ws => ws.ownerId === user.id));
        setIsLoading(false);
      }, 1000);
    }
  }, [authLoading, user]);

  const handleDeleteWorkspace = (workspaceId: string) => {
    // In a real app, this would be an API call
    setWorkspaces(prev => prev.filter(ws => ws.id !== workspaceId));
    // Add toast notification
  };

  const filteredWorkspaces = workspaces.filter(ws => 
    ws.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ws.description && ws.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-4 w-1/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <h1 className="text-3xl font-headline text-foreground">Your Workspaces</h1>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search workspaces..."
              className="pl-8 sm:w-[200px] md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem checked>
                Last Modified
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem>Created Date</DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button asChild>
            <Link href="/dashboard/workspaces/create">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Workspace
            </Link>
          </Button>
        </div>
      </div>

      {filteredWorkspaces.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredWorkspaces.map((workspace) => (
            <WorkspaceCard key={workspace.id} workspace={workspace} onDelete={handleDeleteWorkspace} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Briefcase className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Workspaces Found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? "Try adjusting your search or filter terms." : "Get started by creating your first workspace."}
          </p>
          {!searchTerm && (
            <Button asChild>
              <Link href="/dashboard/workspaces/create">
                <PlusCircle className="mr-2 h-4 w-4" /> Create Workspace
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Basic Card Skeleton for loading state (can be enhanced)
const Card = ({children}: {children: React.ReactNode}) => <div className="border bg-card text-card-foreground shadow-sm rounded-lg p-4">{children}</div>;
const CardHeader = ({children}: {children: React.ReactNode}) => <div className="mb-2">{children}</div>;
const CardContent = ({children}: {children: React.ReactNode}) => <div className="mb-2">{children}</div>;
const CardFooter = ({children}: {children: React.ReactNode}) => <div>{children}</div>;
