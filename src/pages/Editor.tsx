import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentEditor } from '@/components/editor/DocumentEditor';
import { toast } from 'sonner';

// Sample data for existing documents (in a real app, this would be fetched from an API)
const sampleDocuments = {
  '1': {
    title: 'Project Roadmap',
    content: 'This document outlines our Q3 project roadmap with key milestones and deliverables.'
  },
  '2': {
    title: 'Meeting Notes',
    content: 'Notes from our weekly product team meeting with action items.'
  },
  '3': {
    title: 'Design Guidelines',
    content: 'Our brand style guide with color palette, typography, and component specifications.'
  }
};

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const documentData = id ? sampleDocuments[id as keyof typeof sampleDocuments] : null;
  
  useEffect(() => {
    // If an ID is provided but the document doesn't exist, show an error toast
    if (id && !documentData) {
      toast('Document not found', {
        description: 'The document you are looking for does not exist.',
      });
      navigate('/documents');
    }
  }, [id, documentData, navigate]);
  
  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center h-16 px-4 border-b bg-background/80 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/documents')}
          className="mr-2"
        >
          <ArrowLeft size={20} />
          <span className="sr-only">Back to Documents</span>
        </Button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <DocumentEditor
          id={id}
          initialTitle={documentData?.title}
          initialContent={documentData?.content}
        />
      </div>
    </div>
  );
};

export default Editor;
