
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginValues = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = async (values: LoginValues) => {
    try {
      setIsLoading(true);
      await login(values.email, values.password);
      toast('Login successful', {
        description: 'Welcome back to CloudDocs!',
      });
      navigate('/documents');
    } catch (error) {
      toast('Login failed', {
        description: 'Please check your credentials and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="p-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          <span className="sr-only">Back to home</span>
        </Button>
      </div>
      
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="glass-card w-full max-w-md p-8 rounded-xl animate-fade-up">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold mb-2">Log In to CloudDocs</h1>
            <p className="text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <FormControl>
                        <Input 
                          placeholder="Enter your email" 
                          className="pl-10" 
                          type="email"
                          {...field} 
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                      <FormControl>
                        <Input 
                          placeholder="Enter your password" 
                          className="pl-10" 
                          type="password"
                          {...field} 
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full rounded-full gap-2" 
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log In'}
                <LogIn size={18} />
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
