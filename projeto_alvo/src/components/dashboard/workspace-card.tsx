"use client";

import Link from 'next/link';
import type { Workspace } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, ArrowRight, FileText, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

interface WorkspaceCardProps {
  workspace: Workspace;
  onDelete: (workspaceId: string) => void; // Add onDelete prop
}

export function WorkspaceCard({ workspace, onDelete }: WorkspaceCardProps) {
  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Briefcase className="h-7 w-7 text-primary" />
            <CardTitle className="text-xl font-headline hover:text-primary transition-colors">
              <Link href={`/dashboard/workspaces/${workspace.id}`}>
                {workspace.name}
              </Link>
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Workspace options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => alert(`Editing ${workspace.name} (not implemented)`)}>
                <Settings className="mr-2 h-4 w-4" /> Edit Workspace
              </DropdownMenuItem>
              <DropdownMenuItem 
                onSelect={() => onDelete(workspace.id)} 
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <FileText className="mr-2 h-4 w-4" /> Delete Workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="line-clamp-2 h-[2.5em]">
          {workspace.description || 'No description provided.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {/* Placeholder for more details like document count or last activity */}
        <p className="text-xs text-muted-foreground">
          Created: {new Date(workspace.createdAt).toLocaleDateString()}
        </p>
        <p className="text-xs text-muted-foreground">
          Documents: {Math.floor(Math.random() * 10)} (mock)
        </p>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button asChild size="sm" className="w-full">
          <Link href={`/dashboard/workspaces/${workspace.id}`}>
            Open Workspace <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
