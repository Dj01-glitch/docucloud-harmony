
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Document {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  lastEdited: string;
  collaborators?: number;
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
  updateDocument: (id: string, updates: Partial<Document>) => void;
  createDocument: (title?: string, content?: string) => Document;
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

  const getDocument = (id: string) => {
    return documents.find(doc => doc.id === id);
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
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

  const createDocument = (title = 'Untitled Document', content = '') => {
    const newId = String(Date.now());
    const newDoc: Document = {
      id: newId,
      title,
      content,
      excerpt: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
      lastEdited: 'Just now',
      collaborators: 0,
    };

    setDocuments(prev => [newDoc, ...prev]);
    return newDoc;
  };

  return (
    <DocumentContext.Provider value={{ documents, getDocument, updateDocument, createDocument }}>
      {children}
    </DocumentContext.Provider>
  );
};
