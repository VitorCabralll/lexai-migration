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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DOCUMENT_TYPES } from "@/lib/constants";
import type { DocumentType } from "@/types";
import { Loader2, Sparkles } from "lucide-react";
import React from "react";

const generateDocumentSchema = z.object({
  documentType: z.enum(DOCUMENT_TYPES as [DocumentType, ...DocumentType[]], {
    required_error: "You need to select a document type.",
  }),
  details: z.string().min(10, { message: "Please provide more details (min 10 characters)." }).max(2000),
});

type GenerateDocumentFormValues = z.infer<typeof generateDocumentSchema>;

interface DocumentGeneratorFormProps {
  onSubmit: (values: GenerateDocumentFormValues) => Promise<void>;
  isGenerating: boolean;
}

export function DocumentGeneratorForm({ onSubmit, isGenerating }: DocumentGeneratorFormProps) {
  const form = useForm<GenerateDocumentFormValues>({
    resolver: zodResolver(generateDocumentSchema),
    defaultValues: {
      details: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="documentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a legal document type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Details & Context</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Provide specific details, key terms, parties involved, objectives, and any other relevant context for the document generation. The more detail you provide, the better the AI can assist you."
                  className="resize-y min-h-[150px]"
                  rows={6}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isGenerating} className="w-full sm:w-auto">
          {isGenerating ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          Generate Document
        </Button>
      </form>
    </Form>
  );
}
