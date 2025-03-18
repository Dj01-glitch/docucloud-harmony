
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DocumentProps {
  id: string;
  title: string;
  excerpt?: string;
  lastEdited: string;
  collaborators?: number;
  className?: string;
}

export const DocumentCard = ({
  id,
  title,
  excerpt,
  lastEdited,
  collaborators = 0,
  className,
}: DocumentProps) => {
  return (
    <Link
      to={`/editor/${id}`}
      className={cn(
        'glass-card p-6 block group hover:shadow-md hover:scale-[1.02]',
        className
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-3 items-center">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <FileText size={20} />
          </div>
          <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
            {title}
          </h3>
        </div>
      </div>
      
      {excerpt && (
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {excerpt}
        </p>
      )}
      
      <div className="flex items-center justify-between mt-auto pt-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Clock size={14} />
          <span>{lastEdited}</span>
        </div>
        
        {collaborators > 0 && (
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{collaborators} {collaborators === 1 ? 'collaborator' : 'collaborators'}</span>
          </div>
        )}
      </div>
    </Link>
  );
};
