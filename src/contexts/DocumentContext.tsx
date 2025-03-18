
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

export interface Document {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  lastEdited: string;
  collaborators?: number;
  shareId?: string;
  isPublic?: boolean;
}

// Initial documents data
const initialDocuments: Document[] = [
  {
    id: '1',
    title: 'Project Roadmap',
    content: 'This document outlines our Q3 project roadmap with key milestones and deliverables.',
    excerpt: 'Overview of the Q3 project timeline, milestones, and deliverables.',
    lastEdited: 'Today at 2:45 PM',
    collaborators: 3,
  },
  {
    id: '2',
    title: 'Meeting Notes',
    content: 'Notes from the weekly product team meeting with action items.',
    excerpt: 'Notes from the weekly product team meeting with action items.',
    lastEdited: 'Yesterday',
    collaborators: 2,
  },
  {
    id: '3',
    title: 'Design Guidelines',
    content: 'Our brand style guide with color palette, typography, and component specifications.',
    excerpt: 'Brand style guide with color palette, typography, and component specifications.',
    lastEdited: '2 days ago',
    collaborators: 1,
  },
  {
    id: '4',
    title: 'User Research',
    content: 'Summary of user interviews and key findings from the recent user testing.',
    excerpt: 'Summary of user interviews and key findings from the recent user testing.',
    lastEdited: 'Last week',
    collaborators: 0,
  },
  {
    id: '5',
    title: 'Quarterly Report',
    content: 'Q2 financial report with revenue analysis and projections.',
    excerpt: 'Q2 financial report with revenue analysis and projections.',
    lastEdited: '2 weeks ago',
    collaborators: 4,
  },
  {
    id: '6',
    title: 'Marketing Strategy',
    content: 'Digital marketing plan for the upcoming product launch.',
    excerpt: 'Digital marketing plan for the upcoming product launch.',
    lastEdited: '3 weeks ago',
    collaborators: 2,
  },
];

interface DocumentContextType {
  documents: Document[];
  getDocument: (id: string) => Document | undefined;
  getDocumentByShareId: (shareId: string) => Promise<Document | null>;
  updateDocument: (id: string, updates: Partial<Document>) => void;
  createDocument: (title?: string, content?: string) => Promise<Document>; // Changed return type to Promise<Document>
  toggleDocumentPublic: (id: string) => Promise<string | null>;
  loadDocuments: () => Promise<void>;
  loading: boolean;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export const useDocuments = () => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
};

export const DocumentProvider = ({ children }: { children: ReactNode }) => {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  // Load user's documents from Supabase
  const loadDocuments = async () => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('owner_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        const formattedDocs = data.map(doc => ({
          id: doc.id,
          title: doc.title,
          content: typeof doc.content === 'string' ? doc.content : JSON.stringify(doc.content),
          excerpt: typeof doc.content === 'string' 
            ? doc.content.substring(0, 100) + (doc.content.length > 100 ? '...' : '')
            : JSON.stringify(doc.content).substring(0, 100) + '...',
          lastEdited: doc.updated_at ? new Date(doc.updated_at).toLocaleString() : 'Just now',
          shareId: doc.share_id,
          isPublic: doc.is_public,
        }));
        setDocuments(formattedDocs);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, [isAuthenticated, user]);

  const getDocument = (id: string) => {
    return documents.find(doc => doc.id === id);
  };

  const getDocumentByShareId = async (shareId: string) => {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('share_id', shareId)
        .eq('is_public', true)
        .single();

      if (error) {
        console.error('Error fetching shared document:', error);
        return null;
      }

      if (data) {
        return {
          id: data.id,
          title: data.title,
          content: typeof data.content === 'string' ? data.content : JSON.stringify(data.content),
          excerpt: typeof data.content === 'string' 
            ? data.content.substring(0, 100) + (data.content.length > 100 ? '...' : '')
            : JSON.stringify(data.content).substring(0, 100) + '...',
          lastEdited: data.updated_at ? new Date(data.updated_at).toLocaleString() : 'Just now',
          shareId: data.share_id,
          isPublic: data.is_public,
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching shared document:', error);
      return null;
    }
  };

  const updateDocument = async (id: string, updates: Partial<Document>) => {
    if (isAuthenticated && user) {
      try {
        const { error } = await supabase
          .from('documents')
          .update({
            title: updates.title,
            content: updates.content,
            updated_at: new Date().toISOString(),
          })
          .eq('id', id)
          .eq('owner_id', user.id);

        if (error) throw error;
      } catch (error) {
        console.error('Error updating document:', error);
      }
    }

    setDocuments(prevDocs => {
      return prevDocs.map(doc => {
        if (doc.id === id) {
          const updatedDoc = { ...doc, ...updates };
          // If content is updated, generate a new excerpt
          if (updates.content) {
            updatedDoc.excerpt = updates.content.substring(0, 100) + (updates.content.length > 100 ? '...' : '');
          }
          updatedDoc.lastEdited = 'Just now';
          return updatedDoc;
        }
        return doc;
      });
    });
  };

  const createDocument = async (title = 'Untitled Document', content = '') => {
    const newDoc: Document = {
      id: String(Date.now()),
      title,
      content,
      excerpt: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
      lastEdited: 'Just now',
      collaborators: 0,
    };

    if (isAuthenticated && user) {
      try {
        const { data, error } = await supabase
          .from('documents')
          .insert({
            title,
            content,
            owner_id: user.id,
          })
          .select()
          .single();

        if (error) throw error;

        if (data) {
          newDoc.id = data.id;
          newDoc.shareId = data.share_id;
          newDoc.isPublic = data.is_public;
        }
      } catch (error) {
        console.error('Error creating document:', error);
      }
    }

    setDocuments(prev => [newDoc, ...prev]);
    return newDoc;
  };

  const toggleDocumentPublic = async (id: string): Promise<string | null> => {
    if (!isAuthenticated || !user) return null;

    const doc = getDocument(id);
    if (!doc) return null;

    const newIsPublic = !doc.isPublic;

    try {
      const { error, data } = await supabase
        .from('documents')
        .update({ is_public: newIsPublic })
        .eq('id', id)
        .eq('owner_id', user.id)
        .select('share_id')
        .single();

      if (error) throw error;

      // Update local state
      setDocuments(prevDocs => prevDocs.map(d => 
        d.id === id ? { ...d, isPublic: newIsPublic } : d
      ));

      return data?.share_id || null;
    } catch (error) {
      console.error('Error toggling document visibility:', error);
      return null;
    }
  };

  return (
    <DocumentContext.Provider value={{ 
      documents, 
      getDocument, 
      getDocumentByShareId,
      updateDocument, 
      createDocument,
      toggleDocumentPublic,
      loadDocuments,
      loading
    }}>
      {children}
    </DocumentContext.Provider>
  );
};
