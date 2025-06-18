"use client";

import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, Edit2, XCircle, Loader2 } from 'lucide-react';
import type { LegalDocument } from '@/types';

interface DocumentDisplayProps {
  document: LegalDocument;
  onSaveChanges?: (updatedContent: string) => Promise<void>;
}

export function DocumentDisplay({ document, onSaveChanges }: DocumentDisplayProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(document.content);
  const [isSaving, setIsSaving] = useState(false);

  const handleEditToggle = () => {
    if (isEditing) {
      // If canceling edit, revert to original content
      setEditedContent(document.content);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!onSaveChanges) return;
    setIsSaving(true);
    try {
      await onSaveChanges(editedContent);
      setIsEditing(false);
      // Potentially update local document state if parent doesn't re-fetch
    } catch (error) {
      console.error("Failed to save changes", error);
      // Show toast error
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center gap-2">
        {onSaveChanges && (
          <>
            {isEditing ? (
              <>
                <Button onClick={handleSave} disabled={isSaving} size="sm">
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleEditToggle} size="sm" disabled={isSaving}>
                  <XCircle className="mr-2 h-4 w-4" /> Cancel
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={handleEditToggle} size="sm">
                <Edit2 className="mr-2 h-4 w-4" /> Edit Document
              </Button>
            )}
          </>
        )}
      </div>
      <Textarea
        value={isEditing ? editedContent : document.content}
        onChange={(e) => setEditedContent(e.target.value)}
        readOnly={!isEditing}
        className="min-h-[400px] w-full p-4 border rounded-md text-sm leading-relaxed focus-visible:ring-primary"
        aria-label="Document content"
        style={{ 
          backgroundColor: isEditing ? 'var(--card)' : 'hsl(var(--muted) / 0.5)',
          fontFamily: 'var(--font-inter), sans-serif' 
        }}
      />
    </div>
  );
}
