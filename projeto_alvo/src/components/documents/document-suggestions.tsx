"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, CheckCircle2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '../ui/button';

interface DocumentSuggestionsProps {
  suggestions: string[];
  isLoading?: boolean;
  onApplySuggestion?: (suggestion: string, index: number) => void; // Optional: if suggestions can be applied directly
}

export function DocumentSuggestions({ suggestions, isLoading, onApplySuggestion }: DocumentSuggestionsProps) {
  if (isLoading) {
    return (
      <Card className="mt-6 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-headline flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-yellow-500 animate-pulse" />
            Loading AI Suggestions...
          </CardTitle>
          <CardDescription>Our AI is analyzing your document for improvements.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-8 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!suggestions || suggestions.length === 0) {
    return (
       <Card className="mt-6 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg font-headline flex items-center">
            <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />
            No Suggestions
          </CardTitle>
          <CardDescription>The AI found no specific suggestions for improvement at this time.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mt-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-headline flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
          AI-Powered Suggestions
        </CardTitle>
        <CardDescription>Review these suggestions to enhance your document.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] pr-4">
          <ul className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="text-sm p-3 bg-accent/10 rounded-md border border-accent/30">
                <p className="text-foreground">{suggestion}</p>
                {onApplySuggestion && (
                   <Button 
                    variant="link" 
                    size="sm" 
                    className="p-0 h-auto mt-1 text-primary"
                    onClick={() => onApplySuggestion(suggestion, index)}
                  >
                    Apply Suggestion (Not Implemented)
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
