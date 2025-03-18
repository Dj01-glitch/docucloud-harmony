
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock user data
const mockUser: User = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  avatar: 'https://i.pravatar.cc/150?u=demo@example.com',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // In a real app, this would make an API call
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    // For demo purposes, any credentials will work and return the mock user
    setUser(mockUser);
  };

  const signup = async (name: string, email: string, password: string) => {
    // In a real app, this would make an API call
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    // Create a new user with the provided details
    setUser({
      id: Date.now().toString(),
      name,
      email,
      avatar: `https://i.pravatar.cc/150?u=${email}`,
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
