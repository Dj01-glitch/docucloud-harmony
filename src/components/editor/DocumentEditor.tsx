import React, { useState, useEffect } from 'react';
import { Save, Share, Users, ChevronDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';

interface DocumentEditorProps {
  id?: string;
  initialContent?: string;
  initialTitle?: string;
}

export const DocumentEditor = ({
  id,
  initialContent = '',
  initialTitle = 'Untitled Document',
}: DocumentEditorProps) => {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (content.trim() || title !== 'Untitled Document') {
        handleSave();
      }
    }, 30000); // Auto-save every 30 seconds
    
    return () => clearInterval(autoSaveInterval);
  }, [content, title]);
  
  const handleSave = async () => {
    if (isSaving) return;
    
    setIsSaving(true);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setLastSaved(new Date());
    setIsSaving(false);
    
    toast('Document saved', {
      description: 'All changes have been saved to the cloud.',
    });
  };
  
  const handleShare = () => {
    toast('Collaboration link generated', {
      description: 'Share this link with others to collaborate on this document.',
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
            className="text-xl font-medium bg-transparent border-none focus:outline-none focus:ring-0 w-60 md:w-80"
            placeholder="Untitled Document"
          />
          
          {lastSaved && (
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
                  onClick={() => {
                    toast('Changed to Editing mode', {
                      description: 'You can now edit the document',
                    });
                  }}
                >
                  <span className="sr-only">Mode</span>
                  <ChevronDown size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Editing Mode</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <Separator orientation="vertical" className="h-5" />
          
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
            disabled={isSaving}
          >
            <Save size={16} className={isSaving ? 'animate-pulse' : ''} />
            <span className="hidden md:inline-block">
              {isSaving ? 'Saving...' : 'Save'}
            </span>
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 md:p-12 glass-panel">
        <div className="max-w-4xl mx-auto">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full min-h-[calc(100vh-200px)] resize-none bg-transparent border-none focus:outline-none focus:ring-0 text-lg"
            placeholder="Start writing your document here..."
          />
        </div>
      </div>
    </div>
  );
};
