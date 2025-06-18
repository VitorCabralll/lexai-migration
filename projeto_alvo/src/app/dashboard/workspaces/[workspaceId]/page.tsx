"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Workspace, LegalDocument } from '@/types';
import { useAuth } from '@/hooks/use-auth';
import { ArrowLeft, PlusCircle, FileText, Edit3, Trash2, Search, ListFilter, Download, Share2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";


// Mock data
const MOCK_WORKSPACES: Workspace[] = [
  { id: 'ws1', name: 'Alpha Corp Merger', description: 'Documents related to the acquisition of Beta Inc. by Alpha Corp.', ownerId: 'mock-user-id', createdAt: new Date('2023-01-15'), updatedAt: new Date('2023-01-20') },
  { id: 'ws2', name: 'Patent Application - AI Tool', description: 'Drafting and filing patent for new AI discovery tool.', ownerId: 'mock-user-id', createdAt: new Date('2023-03-01'), updatedAt: new Date('2023-03-10') },
];

const MOCK_DOCUMENTS: LegalDocument[] = [
  { id: 'doc1', workspaceId: 'ws1', name: 'Merger Agreement Draft v1', type: 'Contract', content: '...', generatedByAI: true, createdAt: new Date('2023-01-16'), updatedAt: new Date('2023-01-18') },
  { id: 'doc2', workspaceId: 'ws1', name: 'Due Diligence Report', type: 'Brief', content: '...', generatedByAI: false, createdAt: new Date('2023-01-10'), updatedAt: new Date('2023-01-12') },
  { id: 'doc3', workspaceId: 'ws2', name: 'AI Patent Claims', type: 'Other', content: '...', generatedByAI: true, createdAt: new Date('2023-03-05'), updatedAt: new Date('2023-03-08') },
];

export default function WorkspaceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const workspaceId = params.workspaceId as string;

  useEffect(() => {
    if (!authLoading && user && workspaceId) {
      // Simulate fetching workspace and documents
      setTimeout(() => {
        const foundWorkspace = MOCK_WORKSPACES.find(ws => ws.id === workspaceId && ws.ownerId === user.id);
        if (foundWorkspace) {
          setWorkspace(foundWorkspace);
          setDocuments(MOCK_DOCUMENTS.filter(doc => doc.workspaceId === workspaceId));
        } else {
          // Handle workspace not found or not authorized
          router.push('/dashboard/workspaces'); 
        }
        setIsLoading(false);
      }, 1000);
    } else if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, workspaceId, router]);

  const handleDeleteDocument = (documentId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    // Add toast notification
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading || authLoading) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <Skeleton className="h-8 w-48 mb-6" /> {/* Back button */}
        <Card className="mb-8">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
        <Skeleton className="h-10 w-full mb-4" /> {/* Tabs list */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-6 w-2/3" /></CardHeader>
              <CardContent><Skeleton className="h-4 w-1/2" /></CardContent>
              <CardFooter><Skeleton className="h-8 w-full" /></CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!workspace) {
    // This case should be handled by redirect, but as a fallback:
    return <div className="container mx-auto py-8 text-center">Workspace not found or not authorized.</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href="/dashboard/workspaces">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Workspaces
        </Link>
      </Button>

      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl font-headline">{workspace.name}</CardTitle>
              <CardDescription>{workspace.description || 'No description.'}</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => alert('Edit workspace (not implemented)')}>
              <Edit3 className="mr-2 h-4 w-4" /> Edit Workspace
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Created: {new Date(workspace.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="documents" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px] mb-6">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="settings">Workspace Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="documents">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
            <h2 className="text-2xl font-semibold text-foreground">Documents</h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-grow sm:flex-grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search documents..."
                  className="pl-8 sm:w-[200px] md:w-[250px]"
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
                  <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {/* Mock filter options */}
                  <DropdownMenuCheckboxItem>Contract</DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>Brief</DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button asChild>
                <Link href={`/dashboard/workspaces/${workspaceId}/generate`}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Generate Document
                </Link>
              </Button>
            </div>
          </div>

          {filteredDocuments.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="flex flex-col shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <Link href={`/dashboard/workspaces/${workspaceId}/documents/${doc.id}`}>
                        <CardTitle className="text-lg font-semibold hover:text-primary transition-colors">{doc.name}</CardTitle>
                      </Link>
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => router.push(`/dashboard/workspaces/${workspaceId}/documents/${doc.id}`)}>
                            <FileText className="mr-2 h-4 w-4" /> View/Edit
                          </DropdownMenuItem>
                           <DropdownMenuItem onSelect={() => alert('Download (not implemented)')}>
                            <Download className="mr-2 h-4 w-4" /> Download
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => alert('Share (not implemented)')}>
                            <Share2 className="mr-2 h-4 w-4" /> Share
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive focus:bg-destructive/10"
                            onSelect={() => handleDeleteDocument(doc.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardDescription>{doc.type} - Last updated: {new Date(doc.updatedAt).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {doc.content.substring(0,100) || "No content preview."}...
                    </p>
                  </CardContent>
                   <CardFooter className="border-t pt-3">
                     <Button variant="outline" size="sm" className="w-full" asChild>
                        <Link href={`/dashboard/workspaces/${workspaceId}/documents/${doc.id}`}>
                          <FileText className="mr-2 h-4 w-4" /> Open Document
                        </Link>
                      </Button>
                   </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
              <h3 className="text-lg font-semibold text-foreground">No Documents Yet</h3>
              <p className="text-muted-foreground text-sm mb-3">
                {searchTerm ? "No documents match your search." : "Start by generating your first document in this workspace."}
              </p>
              {!searchTerm && (
                <Button asChild>
                   <Link href={`/dashboard/workspaces/${workspaceId}/generate`}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Generate New Document
                  </Link>
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-headline">Workspace Settings</CardTitle>
              <CardDescription>Manage settings for the "{workspace.name}" workspace.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Workspace settings are not yet implemented.</p>
              <Button variant="destructive" onClick={() => alert('Delete workspace (not implemented)')}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Workspace
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
