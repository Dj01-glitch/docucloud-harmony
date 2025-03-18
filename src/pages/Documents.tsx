
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DocumentCard } from '@/components/ui/DocumentCard';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useDocuments } from '@/contexts/DocumentContext';

const Documents = () => {
  const { documents } = useDocuments();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 pt-24 pb-12 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 animate-fade-down">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Documents</h1>
              <p className="text-muted-foreground">
                Access and manage your documents
              </p>
            </div>
            
            <Button asChild className="rounded-full gap-2">
              <Link to="/editor">
                <Plus size={18} />
                <span>New Document</span>
              </Link>
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center mb-8 animate-fade-down">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search documents..."
                className="pl-10 rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button variant="outline" size="icon" className="rounded-full shrink-0">
              <Filter size={18} />
              <span className="sr-only">Filter</span>
            </Button>
          </div>
          
          {filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((doc, index) => (
                <DocumentCard
                  key={doc.id}
                  {...doc}
                  className="animate-fade-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 animate-fade-up">
              <h3 className="text-xl font-medium mb-2">No documents found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? `No documents match "${searchQuery}"`
                  : "You don't have any documents yet"}
              </p>
              <Button asChild className="rounded-full gap-2">
                <Link to="/editor">
                  <Plus size={18} />
                  <span>Create your first document</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Documents;
