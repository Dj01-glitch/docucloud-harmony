
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Users, Clock, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const Index: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white" />
            <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-blue-100/50 to-transparent" />
            <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-100/50 blur-3xl opacity-70" />
            <div className="absolute top-40 -left-40 w-80 h-80 rounded-full bg-blue-200/30 blur-3xl opacity-70" />
          </div>
          
          <div className="container px-6 mx-auto max-w-6xl">
            <div className="text-center space-y-6 max-w-3xl mx-auto animate-fade-up">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                Collaborate on documents with elegance
              </h1>
              <p className="text-xl text-muted-foreground">
                Cloud-based document collaboration with a beautiful, intuitive interface.
                Create, edit, and share documents with your team in real-time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Button asChild size="lg" className="rounded-full px-8">
                  <Link to="/documents">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                  <Link to="/editor">New Document</Link>
                </Button>
              </div>
            </div>
            
            <div className="mt-20 relative">
              <div className="glass-card p-1 rounded-2xl shadow-xl shadow-blue-500/5 overflow-hidden animate-blur-in">
                <img 
                  src="https://images.unsplash.com/photo-1638643391904-9b551ba91eaa?w=1200&h=800&auto=format&fit=crop&q=90" 
                  alt="CloudDocs Interface" 
                  className="rounded-xl w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
              
              {/* Floating UI elements */}
              <div className="absolute -top-6 left-10 glass-panel rounded-lg p-3 shadow-lg animate-float" style={{ animationDelay: '0.1s' }}>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm font-medium">3 people editing</span>
                </div>
              </div>
              
              <div className="absolute -bottom-4 right-10 glass-panel rounded-lg p-3 shadow-lg animate-float" style={{ animationDelay: '0.3s' }}>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  <span className="text-sm font-medium">Auto-saved</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-24 px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16 animate-fade-up">
              <h2 className="text-3xl font-bold mb-4">Designed for seamless collaboration</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Every detail has been considered to create an elegant and productive document editing experience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <FileText className="h-10 w-10 text-primary" />,
                  title: 'Beautiful Documents',
                  description: 'Create stunning documents with a clean, distraction-free interface that focuses on your content.'
                },
                {
                  icon: <Users className="h-10 w-10 text-primary" />,
                  title: 'Real-time Collaboration',
                  description: 'Work together with your team in real-time, seeing each other's changes as they happen.'
                },
                {
                  icon: <Lock className="h-10 w-10 text-primary" />,
                  title: 'Secure Cloud Storage',
                  description: 'Your documents are securely stored in the cloud, accessible from anywhere, anytime.'
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="glass-card p-8 flex flex-col items-center text-center animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-24 px-6 bg-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-t from-blue-50 to-transparent" />
            <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-blue-100/50 blur-3xl opacity-70" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-blue-200/30 blur-3xl opacity-70" />
          </div>
          
          <div className="container mx-auto max-w-4xl text-center animate-fade-up">
            <h2 className="text-3xl font-bold mb-4">Ready to collaborate?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start creating beautiful documents and collaborating with your team today. 
              No credit card required.
            </p>
            <Button asChild size="lg" className="rounded-full px-8">
              <Link to="/documents">Get Started</Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
