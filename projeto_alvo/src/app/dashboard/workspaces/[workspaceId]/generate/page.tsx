"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DocumentGeneratorForm } from '@/components/documents/document-generator-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { generateLegalDocument, type GenerateLegalDocumentInput, type GenerateLegalDocumentOutput } from '@/ai/flows/generate-legal-document';
import { useAuth } from '@/hooks/use-auth';
import type { Workspace } from '@/types';
import { ArrowLeft, FileText, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Mock data
const MOCK_WORKSPACES: Workspace[] = [
  { id: 'ws1', name: 'Alpha Corp Merger', description: 'Documents related to the acquisition of Beta Inc. by Alpha Corp.', ownerId: 'mock-user-id', createdAt: new Date('2023-01-15'), updatedAt: new Date('2023-01-20') },
  { id: 'ws2', name: 'Patent Application - AI Tool', description: 'Drafting and filing patent for new AI discovery tool.', ownerId: 'mock-user-id', createdAt: new Date('2023-03-01'), updatedAt: new Date('2023-03-10') },
];


export default function GenerateDocumentPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDocument, setGeneratedDocument] = useState<GenerateLegalDocumentOutput | null>(null);

  const workspaceId = params.workspaceId as string;

  useEffect(() => {
    if (!authLoading && user && workspaceId) {
      setTimeout(() => { // Simulate API call
        const foundWorkspace = MOCK_WORKSPACES.find(ws => ws.id === workspaceId && ws.ownerId === user.id);
        if (foundWorkspace) {
          setWorkspace(foundWorkspace);
        } else {
          toast({ variant: "destructive", title: "Error", description: "Workspace not found or unauthorized." });
          router.push('/dashboard/workspaces');
        }
        setIsLoadingWorkspace(false);
      }, 500);
    } else if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, workspaceId, router, toast]);

  const handleSubmit = async (values: GenerateLegalDocumentInput) => {
    setIsGenerating(true);
    setGeneratedDocument(null);
    try {
      const result = await generateLegalDocument(values);
      setGeneratedDocument(result);
      toast({
        title: "Document Generated",
        description: `A draft for "${values.documentType}" has been successfully generated.`,
      });
      // In a real app, you'd save this document to Firestore and potentially redirect
      // or offer options to save/edit.
      // For now, just display it.
    } catch (error) {
      console.error("Error generating document:", error);
      toast({
        variant: "destructive",
        title: "Generation Failed",
        description: (error as Error).message || "An unexpected error occurred while generating the document.",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  if (authLoading || isLoadingWorkspace) {
     return (
      <div className="container mx-auto py-8 px-4 md:px-6">
        <Skeleton className="h-8 w-48 mb-6" />
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-10 w-1/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!workspace) {
     return <div className="container mx-auto py-8 text-center">Error loading workspace information.</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href={`/dashboard/workspaces/${workspaceId}`}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {workspace.name}
        </Link>
      </Button>

      <Card className="max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Generate New Legal Document</CardTitle>
          <CardDescription>
            Provide details for the AI to draft your document for workspace: <strong className="text-primary">{workspace.name}</strong>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentGeneratorForm onSubmit={handleSubmit} isGenerating={isGenerating} />
        </CardContent>
      </Card>

      {isGenerating && (
        <Card className="max-w-3xl mx-auto mt-8 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-headline flex items-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Document...
            </CardTitle>
            <CardDescription>The AI is working on your draft. This may take a few moments.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      )}

      {generatedDocument && (
        <Card className="max-w-3xl mx-auto mt-8 shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-headline">Generated Document Draft</CardTitle>
              <Button size="sm" onClick={() => alert("Save document (not implemented)")}>
                <FileText className="mr-2 h-4 w-4" /> Save Document
              </Button>
            </div>
            <CardDescription>Review the AI-generated draft below. You can copy, edit, or save it.</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              readOnly
              value={generatedDocument.documentDraft}
              className="min-h-[300px] bg-muted/30 p-4 rounded-md text-sm leading-relaxed"
              aria-label="Generated document draft"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
