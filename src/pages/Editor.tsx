
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DocumentEditor } from '@/components/editor/DocumentEditor';
import { toast } from 'sonner';
import { useDocuments } from '@/contexts/DocumentContext';
import { useAuth } from '@/contexts/AuthContext';

const Editor = () => {
  const { id, shareId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { getDocument, getDocumentByShareId } = useDocuments();
  const { isAuthenticated } = useAuth();
  const [documentData, setDocumentData] = useState<{ title: string; content: string } | null>(null);
  const [loading, setLoading] = useState(true);
  
  const isSharedView = location.pathname.includes('/share/');
  
  useEffect(() => {
    const loadDocument = async () => {
      setLoading(true);
      
      if (isSharedView && shareId) {
        // Handle shared document view
        const sharedDoc = await getDocumentByShareId(shareId);
        if (sharedDoc) {
          setDocumentData({
            title: sharedDoc.title,
            content: sharedDoc.content
          });
        } else {
          toast('Document not found or not public', {
            description: 'The document you are looking for does not exist or is not shared publicly.',
          });
          navigate('/documents');
        }
      } else if (id) {
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
      
      setLoading(false);
    };
    
    loadDocument();
  }, [id, shareId, isSharedView, getDocument, getDocumentByShareId, navigate]);
  
  return (
    <div className="flex flex-col h-screen">
      <div className="flex items-center h-16 px-4 border-b bg-background/80 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(isAuthenticated ? '/documents' : '/')}
          className="mr-2"
        >
          <ArrowLeft size={20} />
          <span className="sr-only">Back to Documents</span>
        </Button>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {!loading && documentData && (
          <DocumentEditor
            id={id}
            initialTitle={documentData.title}
            initialContent={documentData.content}
            isSharedView={isSharedView}
            shareId={shareId}
          />
        )}
      </div>
    </div>
  );
};

export default Editor;
