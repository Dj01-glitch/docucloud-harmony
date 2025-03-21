import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings, LogOut, User, Mail, FileText, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useDocuments } from '@/contexts/DocumentContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { documents } = useDocuments();
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  const recentDocuments = documents.slice(0, 3);
  
  const handleLogout = async () => {
    try {
      await logout();
      toast('Logged out', {
        description: 'You have been successfully logged out.',
      });
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast('Error', {
        description: 'There was an error logging out. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigate('/documents')}>
          <ArrowLeft size={20} />
          <span className="sr-only">Back to documents</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <LogOut size={20} />
              <span className="sr-only">Account options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleLogout} className="text-red-500">
              <LogOut size={16} className="mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex-1 container max-w-4xl mx-auto p-6">
        <div className="text-center mb-12 animate-fade-up">
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Mail size={16} />
            {user.email}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-6 rounded-xl animate-fade-up" style={{ animationDelay: '100ms' }}>
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <User size={18} className="text-primary" />
              Account Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="font-medium">{user.email}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Account ID</p>
                <p className="font-medium">{user.id}</p>
              </div>
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex justify-between">
              <Button variant="outline" className="gap-2">
                <Settings size={16} />
                Edit Profile
              </Button>
              
              <Button variant="outline" onClick={handleLogout} className="gap-2 text-red-500 hover:bg-red-50 hover:text-red-600">
                <LogOut size={16} />
                Logout
              </Button>
            </div>
          </div>
          
          <div className="glass-card p-6 rounded-xl animate-fade-up" style={{ animationDelay: '200ms' }}>
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
              <FileText size={18} className="text-primary" />
              Recent Documents
            </h2>
            
            {recentDocuments.length > 0 ? (
              <div className="space-y-4">
                {recentDocuments.map(doc => (
                  <Link 
                    key={doc.id} 
                    to={`/editor/${doc.id}`}
                    className="block p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-medium">{doc.title}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                      {doc.excerpt}
                    </p>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock size={14} className="mr-1" />
                      {doc.lastEdited}
                    </div>
                  </Link>
                ))}
                
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link to="/documents">View All Documents</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You haven't created any documents yet</p>
                <Button asChild>
                  <Link to="/editor">Create Your First Document</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
