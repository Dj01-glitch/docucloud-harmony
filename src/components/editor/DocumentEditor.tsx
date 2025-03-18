import React, { useState, useEffect } from 'react';
import { Save, Share, Users, ChevronDown, MoreHorizontal, Copy, Eye, Edit, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useDocuments } from '@/contexts/DocumentContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface DocumentEditorProps {
  id?: string;
  initialContent?: string;
  initialTitle?: string;
  isSharedView?: boolean;
  shareId?: string;
}

export const DocumentEditor = ({
  id,
  initialContent = '',
  initialTitle = 'Untitled Document',
  isSharedView = false,
  shareId,
}: DocumentEditorProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isEditMode, setIsEditMode] = useState(!isSharedView);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  
  const { updateDocument, createDocument, toggleDocumentPublic, getDocument } = useDocuments();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (id) {
      const doc = getDocument(id);
      if (doc) {
        setIsPublic(!!doc.isPublic);
      }
    }
  }, [id, getDocument]);
  
  useEffect(() => {
    if (!isSharedView) {
      const autoSaveInterval = setInterval(() => {
        if ((content.trim() || title !== 'Untitled Document') && isEditMode) {
          handleSave();
        }
      }, 30000); // Auto-save every 30 seconds
      
      return () => clearInterval(autoSaveInterval);
    }
  }, [content, title, isEditMode, isSharedView]);
  
  const handleSave = async () => {
    if (isSaving || isSharedView) return;
    
    setIsSaving(true);
    
    if (id) {
      // Update existing document
      updateDocument(id, { title, content });
      setLastSaved(new Date());
      setIsSaving(false);
      
      toast('Document saved', {
        description: 'All changes have been saved to the cloud.',
      });
    } else {
      // Create new document and navigate to it
      try {
        const newDoc = await createDocument(title, content);
        navigate(`/editor/${newDoc.id}`, { replace: true });
        setLastSaved(new Date());
        
        toast('Document saved', {
          description: 'All changes have been saved to the cloud.',
        });
      } catch (error) {
        console.error('Error creating document:', error);
        toast('Error saving document', {
          description: 'There was an error saving your document. Please try again.',
        });
      } finally {
        setIsSaving(false);
      }
    }
  };
  
  const handleShare = async () => {
    if (!id) {
      // If this is a new document, save it first
      try {
        const newDoc = await createDocument(title, content);
        navigate(`/editor/${newDoc.id}`, { replace: true });
        return;
      } catch (error) {
        console.error('Error creating document before sharing:', error);
        toast('Error saving document', {
          description: 'There was an error saving your document before sharing. Please try again.',
        });
        return;
      }
    }
    
    // Toggle the document's public status and get the share ID
    const shareId = await toggleDocumentPublic(id);
    
    if (shareId) {
      const baseUrl = window.location.origin;
      const newShareLink = `${baseUrl}/editor/share/${shareId}`;
      setShareLink(newShareLink);
      setIsPublic(!isPublic);
      setShareDialogOpen(true);
      
      toast(isPublic ? 'Document sharing disabled' : 'Document sharing enabled', {
        description: isPublic ? 'The document is now private.' : 'Anyone with the link can now view this document.',
      });
    }
  };
  
  const copyShareLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast('Link copied to clipboard', {
      description: 'Share this link with others to collaborate on this document.',
    });
  };
  
  const toggleEditMode = () => {
    if (isSharedView) {
      toast('Sign in required', {
        description: 'You need to sign in to edit this document.',
      });
      return;
    }
    
    setIsEditMode(!isEditMode);
    toast(isEditMode ? 'Switched to viewing mode' : 'Switched to editing mode', {
      description: isEditMode 
        ? 'You can now view the document as others will see it.' 
        : 'You can now edit the document.',
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between py-2 px-6 border-b">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={!isEditMode || isSharedView}
            className="text-xl font-medium bg-transparent border-none focus:outline-none focus:ring-0 w-60 md:w-80 disabled:opacity-70"
            placeholder="Untitled Document"
          />
          
          {isSharedView && (
            <Badge variant="secondary" className="ml-2">Shared View</Badge>
          )}
          
          {lastSaved && !isSharedView && (
            <span className="text-xs text-muted-foreground hidden md:inline-block">
              Last saved {lastSaved.toLocaleTimeString()}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground rounded-full h-9 w-9 p-0"
                  onClick={toggleEditMode}
                >
                  <span className="sr-only">Toggle Mode</span>
                  {isEditMode ? <Eye size={18} /> : <Edit size={18} />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isEditMode ? 'Switch to Viewing Mode' : 'Switch to Editing Mode'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Separator orientation="vertical" className="h-5" />
          
          {!isSharedView && isAuthenticated && (
            <>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground rounded-full h-9 w-9 p-0"
                      onClick={handleShare}
                    >
                      <span className="sr-only">Share</span>
                      <Share size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share Document</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground rounded-full h-9 w-9 p-0"
                    >
                      <span className="sr-only">Collaborators</span>
                      <Users size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Collaborators</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground rounded-full h-9 w-9 p-0"
                    >
                      <span className="sr-only">More options</span>
                      <MoreHorizontal size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>More Options</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Separator orientation="vertical" className="h-5" />
              
              <Button
                size="sm"
                onClick={handleSave}
                className="rounded-full gap-1 px-4"
                disabled={isSaving || !isEditMode}
              >
                <Save size={16} className={isSaving ? 'animate-pulse' : ''} />
                <span className="hidden md:inline-block">
                  {isSaving ? 'Saving...' : 'Save'}
                </span>
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 md:p-12 glass-panel">
        <div className="max-w-4xl mx-auto">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={!isEditMode}
            className="w-full h-full min-h-[calc(100vh-200px)] resize-none bg-transparent border-none focus:outline-none focus:ring-0 text-lg disabled:opacity-70"
            placeholder="Start writing your document here..."
          />
        </div>
      </div>
      
      {/* Share Dialog */}
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Document</DialogTitle>
            <DialogDescription>
              Anyone with this link can {isEditMode ? 'edit' : 'view'} this document.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2 mt-4">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">Share Link</Label>
              <Input
                id="link"
                value={shareLink}
                readOnly
                className="font-mono text-sm"
              />
            </div>
            <Button type="submit" size="sm" className="px-3" onClick={copyShareLink}>
              <span className="sr-only">Copy</span>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <Switch checked={isPublic} onCheckedChange={handleShare} />
            <Label>Document Sharing {isPublic ? 'Enabled' : 'Disabled'}</Label>
          </div>
          <DialogFooter className="sm:justify-start mt-4">
            <Button type="button" variant="secondary" onClick={() => setShareDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
