
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentEditor } from '@/components/editor/DocumentEditor';
import { toast } from 'sonner';
import { useDocuments } from '@/contexts/DocumentContext';

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDocument, createDocument } = useDocuments();
  const [documentData, setDocumentData] = useState<{ title: string; content: string } | null>(null);
  
  useEffect(() => {
    if (id) {
      // Editing existing document
      const doc = getDocument(id);
      if (doc) {
        setDocumentData({
          title: doc.title,
          content: doc.content
        });
      } else {
        toast('Document not found', {
          description: 'The document you are looking for does not exist.',
        });
        navigate('/documents');
      }
    } else {
      // New document - initialize with empty content
      setDocumentData({
        title: 'Untitled Document',
        content: ''
      });
    }
  }, [id, getDocument, navigate]);
  
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
        {documentData && (
          <DocumentEditor
            id={id}
            initialTitle={documentData.title}
            initialContent={documentData.content}
          />
        )}
      </div>
    </div>
  );
};

export default Editor;
