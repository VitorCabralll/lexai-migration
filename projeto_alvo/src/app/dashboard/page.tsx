"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { FileText, Briefcase, ArrowRight, PlusCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-headline tracking-tight text-foreground sm:text-4xl">
          Welcome back, {user?.displayName || user?.email || "User"}!
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Ready to streamline your legal work with AI?
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Briefcase className="h-8 w-8 text-primary" />
              <CardTitle className="text-2xl font-headline">Workspaces</CardTitle>
            </div>
            <CardDescription>Organize your legal projects and documents efficiently.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your existing workspaces or create a new one to get started.
            </p>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/dashboard/workspaces">
                  View Workspaces <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/workspaces/create">
                  <PlusCircle className="mr-2 h-4 w-4" /> New Workspace
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-accent" />
              <CardTitle className="text-2xl font-headline">Generate Documents</CardTitle>
            </div>
            <CardDescription>Leverage AI to draft legal documents in minutes.</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-sm text-muted-foreground mb-4">
              Select a workspace and start generating contracts, briefs, and more.
            </p>
            <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
               <Link href="/dashboard/workspaces">
                Go to Workspaces to Generate <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2 lg:col-span-1 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
           <CardHeader>
            <CardTitle className="text-2xl font-headline">LexAI Assistant</CardTitle>
            <CardDescription>Your intelligent partner for legal tasks.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col items-center justify-center">
            <Image 
              src="https://placehold.co/300x200.png"
              alt="AI Assistant Illustration"
              width={300}
              height={200}
              className="rounded-md mb-4"
              data-ai-hint="legal AI assistant"
            />
            <p className="text-sm text-center text-muted-foreground">
              Explore AI-powered suggestions, document analysis, and more.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
