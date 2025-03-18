
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

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

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Documents', path: '/documents' },
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
          
          <Button asChild className="rounded-full w-10 h-10 p-0">
            <Link to="/" aria-label="User Account">
              <User size={18} />
            </Link>
          </Button>
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
            
            <Button 
              asChild 
              variant="outline" 
              className="rounded-full px-6 animate-fade-up w-40"
              style={{ '--index': navItems.length } as React.CSSProperties}
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
