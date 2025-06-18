"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorkspaceForm } from '@/components/dashboard/workspace-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth'; // To get ownerId
import type { Workspace } from '@/types'; // For type usage if needed
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


export default function CreateWorkspacePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth(); // Assuming useAuth provides the current user
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: { name: string; description?: string }) => {
    if (!user) {
      toast({ variant: "destructive", title: "Error", description: "You must be logged in to create a workspace." });
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    console.log("Creating workspace:", { ...values, ownerId: user.id });
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock success
    toast({
      title: "Workspace Created",
      description: `Workspace "${values.name}" has been successfully created.`,
    });
    setIsSubmitting(false);
    router.push('/dashboard/workspaces'); // Redirect to workspaces list or the new workspace page
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Button variant="outline" size="sm" asChild className="mb-6">
        <Link href="/dashboard/workspaces">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Workspaces
        </Link>
      </Button>
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-headline">Create New Workspace</CardTitle>
          <CardDescription>
            Set up a new workspace to organize your legal projects and documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WorkspaceForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting}
            submitButtonText="Create Workspace"
          />
        </CardContent>
      </Card>
    </div>
  );
}
