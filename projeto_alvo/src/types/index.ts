export interface User {
  id: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type DocumentType = 'Contract' | 'Brief' | 'Legal Opinion' | 'Affidavit' | 'Other';

export interface LegalDocument {
  id: string;
  workspaceId: string;
  name: string;
  type: DocumentType;
  content: string;
  generatedByAI: boolean;
  createdAt: Date;
  updatedAt: Date;
  suggestions?: string[];
}
