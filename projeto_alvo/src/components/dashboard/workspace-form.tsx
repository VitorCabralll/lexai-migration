"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Workspace } from "@/types";
import { Loader2 } from "lucide-react";
import React from "react";

const workspaceSchema = z.object({
  name: z.string().min(3, { message: "Workspace name must be at least 3 characters." }).max(100),
  description: z.string().max(500).optional(),
});

type WorkspaceFormValues = z.infer<typeof workspaceSchema>;

interface WorkspaceFormProps {
  initialData?: Workspace;
  onSubmit: (values: WorkspaceFormValues) => Promise<void>;
  isSubmitting: boolean;
  submitButtonText?: string;
}

export function WorkspaceForm({ 
  initialData, 
  onSubmit, 
  isSubmitting,
  submitButtonText = "Save Workspace" 
}: WorkspaceFormProps) {
  const form = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Workspace Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Alpha Corp Merger Case" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="A brief description of this workspace and its purpose."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitButtonText}
        </Button>
      </form>
    </Form>
  );
}
