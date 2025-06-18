"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DocumentDisplay } from '@/components/documents/document-display';
import { DocumentSuggestions } from '@/components/documents/document-suggestions';
import type { Workspace, LegalDocument } from '@/types';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { improveLegalDocument, type ImproveLegalDocumentInput, type ImproveLegalDocumentOutput } from '@/ai/flows/improve-legal-document';
import { ArrowLeft, FileText, Lightbulb, Loader2, Download, Share2, Trash2, Edit3 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


// Mock data
const MOCK_WORKSPACES: Workspace[] = [
  { id: 'ws1', name: 'Alpha Corp Merger', ownerId: 'mock-user-id', createdAt: new Date(), updatedAt: new Date() },
  { id: 'ws2', name: 'Patent Application', ownerId: 'mock-user-id', createdAt: new Date(), updatedAt: new Date() },
];
const MOCK_DOCUMENTS: LegalDocument[] = [
  { id: 'doc1', workspaceId: 'ws1', name: 'Merger Agreement Draft v1', type: 'Contract', content: 'This is the first draft of the merger agreement between Alpha Corp and Beta Inc. Key terms include...', generatedByAI: true, createdAt: new Date(), updatedAt: new Date(), suggestions: ["Consider adding a clause for intellectual property rights.", "Specify the governing law more clearly."] },
  { id: 'doc2', workspaceId: 'ws1', name: 'Due Diligence Report', type: 'Brief', content: 'The due diligence report covers financial, legal, and operational aspects of Beta Inc.', generatedByAI: false, createdAt: new Date(), updatedAt: new Date() },
  { id: 'doc3', workspaceId: 'ws2', name: 'AI Patent Claims', type: 'Other', content: 'Claim 1: A method for AI-driven legal research comprising steps A, B, and C.', generatedByAI: true, createdAt: new Date(), updatedAt: new Date() },
];


export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [document, setDocument] = useState<LegalDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isImproving, setIsImproving] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const workspaceId = params.workspaceId as string;
  const documentId = params.documentId as string;

  useEffect(() => {
    if (!authLoading && user && workspaceId && documentId) {
      // Simulate fetching data
      setTimeout(() => {
        const foundWorkspace = MOCK_WORKSPACES.find(ws => ws.id === workspaceId && ws.ownerId === user.id);
        const foundDocument = MOCK_DOCUMENTS.find(doc => doc.id === documentId && doc.workspaceId === workspaceId);

        if (foundWorkspace && foundDocument) {
          setWorkspace(foundWorkspace);
          setDocument(foundDocument);
          setAiSuggestions(foundDocument.suggestions || []);
        } else {
          toast({ variant: "destructive", title: "Error", description: "Document or workspace not found or unauthorized." });
          router.push(`/dashboard/workspaces/${workspaceId}`);
        }
        setIsLoading(false);
      }, 1000);
    } else if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, workspaceId, documentId, router, toast]);

  const handleImproveDocument = async () => {
    if (!document) return;
    setIsImproving(true);
    try {
      const result: ImproveLegalDocumentOutput = await improveLegalDocument({ documentText: document.content });
      setDocument(prevDoc => prevDoc ? { ...prevDoc, content: result.improvedDocumentText, updatedAt: new Date() } : null);
      setAiSuggestions(result.suggestions);
      toast({ title: "Document Improved", description: "AI suggestions have been applied and listed." });
    } catch (error) {
      console.error("Error improving document:", error);
      toast({ variant: "destructive", title: "Improvement Failed", description: (error as Error).message });
    } finally {
      setIsImproving(false);
    }
  };
  
  const handleSaveChanges = async (updatedContent: string) => {
    if (!document) return;
    // Simulate saving to backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    setDocument(prev => prev ? {...prev, content: updatedContent, updatedAt: new Date()} : null);
    toast({ title: "Changes Saved", description: "Your document has been updated." });
  };


  if (isLoading || authLoading) {
    return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <Skeleton className="h-8 w-64 mb-6" />
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-3/5" />
              <Skeleton className="h-8 w-24" />
            </div>
            <Skeleton className="h-4 w-2/5 mt-2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-64 w-full" /> {/* Document display area */}
            <Skeleton className="h-32 w-full" /> {/* Suggestions area */}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!document || !workspace) {
    return <div className="container mx-auto py-8 text-center">Document not found.</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href={`/dashboard/workspaces/${workspaceId}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {workspace.name}
          </Link>
        </Button>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => alert("Download (not implemented)")}>
                <Download className="mr-2 h-4 w-4" /> Download
            </Button>
            <Button variant="outline" size="sm" onClick={() => alert("Share (not implemented)")}>
                <Share2 className="mr-2 h-4 w-4" /> Share
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" outline>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the document "{document.name}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => {
                    alert("Delete (not implemented)");
                    router.push(`/dashboard/workspaces/${workspaceId}`);
                  }}>
                    Delete Document
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </div>
      </div>

      <Card className="shadow-xl">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <CardTitle className="text-2xl font-headline flex items-center">
                <FileText className="mr-3 h-7 w-7 text-primary" />
                {document.name}
              </CardTitle>
              <CardDescription>
                Type: {document.type} | Last Updated: {new Date(document.updatedAt).toLocaleString()}
              </CardDescription>
            </div>
            <Button onClick={handleImproveDocument} disabled={isImproving} size="sm" className="mt-2 sm:mt-0 self-start sm:self-center bg-accent hover:bg-accent/90 text-accent-foreground">
              {isImproving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Lightbulb className="mr-2 h-4 w-4" />
              )}
              AI Improve Document
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold mb-2 font-headline">Document Content</h3>
            <DocumentDisplay document={document} onSaveChanges={handleSaveChanges} />
          </div>
          <div className="lg:col-span-1">
             <h3 className="text-lg font-semibold mb-2 font-headline">AI Suggestions</h3>
            <DocumentSuggestions suggestions={aiSuggestions} isLoading={isImproving} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
