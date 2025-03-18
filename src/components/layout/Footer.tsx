
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Github, Twitter, Linkedin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-muted/30 border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link to="/" className="text-xl font-medium flex items-center gap-2">
            <FileText className="text-primary" />
            <span>CloudDocs</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Collaborative document editing with a beautiful, minimalist interface.
          </p>
          <div className="flex space-x-4 pt-2">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4 text-sm uppercase tracking-wider text-muted-foreground">
            Product
          </h3>
          <ul className="space-y-2">
            {['Features', 'Pricing', 'FAQ', 'Testimonials'].map((item) => (
              <li key={item}>
                <Link
                  to="#"
                  className="text-sm text-foreground/80 hover:text-primary transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-medium mb-4 text-sm uppercase tracking-wider text-muted-foreground">
            Resources
          </h3>
          <ul className="space-y-2">
            {['Documentation', 'Tutorials', 'Blog', 'Support'].map((item) => (
              <li key={item}>
                <Link
                  to="#"
                  className="text-sm text-foreground/80 hover:text-primary transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-medium mb-4 text-sm uppercase tracking-wider text-muted-foreground">
            Company
          </h3>
          <ul className="space-y-2">
            {['About', 'Careers', 'Privacy', 'Terms'].map((item) => (
              <li key={item}>
                <Link
                  to="#"
                  className="text-sm text-foreground/80 hover:text-primary transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-border/50">
        <p className="text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} CloudDocs. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
