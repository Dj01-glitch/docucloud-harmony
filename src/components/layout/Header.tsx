
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, FileText, LogIn, UserPlus, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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
        variant: 'destructive',
      });
    }
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Documents', path: '/documents' },
  ];
  
  const authItems = isAuthenticated
    ? [
        { name: 'Profile', path: '/profile', icon: <User size={18} /> },
      ]
    : [
        { name: 'Log In', path: '/login', icon: <LogIn size={18} /> },
        { name: 'Sign Up', path: '/signup', icon: <UserPlus size={18} /> },
      ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 py-4 px-6 transition-all duration-300',
        isScrolled 
          ? 'bg-background/80 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link 
          to="/" 
          className="text-2xl font-medium flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <FileText className="text-primary" />
          <span>CloudDocs</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                location.pathname === item.path 
                  ? 'text-primary' 
                  : 'text-foreground/80'
              )}
            >
              {item.name}
            </Link>
          ))}
          
          <Button asChild variant="outline" className="rounded-full px-6">
            <Link to="/editor">New Document</Link>
          </Button>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full w-10 h-10 p-0 overflow-hidden">
                  <Avatar>
                    <AvatarImage src={user?.avatar} alt={user?.name || ''} />
                    <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User size={16} className="mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                  <LogOut size={16} className="mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="rounded-full gap-2">
              <Link to="/login">
                <LogIn size={18} />
                <span>Log In</span>
              </Link>
            </Button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 rounded-full hover:bg-muted"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-sm z-40 animate-fade-in">
          <nav className="flex flex-col items-center justify-center h-full space-y-8 p-4">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'text-xl font-medium transition-colors hover:text-primary animate-fade-up',
                  location.pathname === item.path ? 'text-primary' : 'text-foreground/80'
                )}
                style={{ '--index': index } as React.CSSProperties}
              >
                {item.name}
              </Link>
            ))}
            
            {authItems.map((item, index) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  'text-xl font-medium transition-colors hover:text-primary animate-fade-up flex items-center gap-2',
                  location.pathname === item.path ? 'text-primary' : 'text-foreground/80'
                )}
                style={{ '--index': navItems.length + index } as React.CSSProperties}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            
            {isAuthenticated && (
              <Button 
                variant="destructive" 
                onClick={() => {
                  handleLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="animate-fade-up flex items-center gap-2"
                style={{ '--index': navItems.length + authItems.length + 1 } as React.CSSProperties}
              >
                <LogOut size={18} />
                Logout
              </Button>
            )}
            
            <Button 
              asChild 
              variant="outline" 
              className="rounded-full px-6 animate-fade-up w-40"
              style={{ '--index': navItems.length + authItems.length } as React.CSSProperties}
            >
              <Link to="/editor" onClick={() => setIsMobileMenuOpen(false)}>
                New Document
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};
