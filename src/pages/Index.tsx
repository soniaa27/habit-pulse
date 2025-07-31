import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AuthForm } from '@/components/auth/AuthForm';
import { Dashboard } from '@/pages/Dashboard';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
    );
  }

  // Check if Supabase is properly configured
  try {
    // This is a simple check - if the client was created successfully, Supabase should be configured
    if (!user) {
      return <AuthForm />;
    }
  } catch (error) {
    // Supabase not properly configured
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">Smart Habit Tracker</CardTitle>
            <CardDescription>
              Your Smart Habit Tracker is almost ready!
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              The Supabase integration is being set up. Once complete, you'll be able to:
            </p>
            <ul className="text-left text-sm space-y-2 text-muted-foreground">
              <li>• Create and track daily habits</li>
              <li>• View progress with streaks and analytics</li>
              <li>• Set reminders and time tracking</li>
              <li>• Visualize data with charts and calendar</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Please wait a moment for the integration to complete, then refresh the page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <Dashboard />;
};

export default Index;
