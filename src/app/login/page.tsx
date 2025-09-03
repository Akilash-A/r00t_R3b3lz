'use client';

import { useActionState, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { authenticate } from '@/lib/actions';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Terminal, LogIn, AlertCircle } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

// Dynamically import DotGrid to prevent SSR issues
const DotGrid = dynamic(() => import('@/components/dot-grid'), {
  ssr: false,
  loading: () => null
});

function LoginButton() {
  return (
    <Button type="submit" className="w-full">
      <LogIn className="mr-2 h-4 w-4" />
      Login
    </Button>
  );
}

export default function LoginPage() {
  const [errorMessage, dispatch] = useActionState(authenticate, undefined);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-background p-4 pt-32" suppressHydrationWarning>
        <DotGrid
          dotSize={5}
          gap={15}
          baseColor="#5227FF"
          activeColor="#5227FF"
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
          className="absolute inset-0"
        />
        <div className="relative z-10 w-full max-w-sm" suppressHydrationWarning>
          <div className="flex flex-col items-center mb-6">
            <Terminal className="h-10 w-10 text-primary" suppressHydrationWarning />
            <h1 className="text-2xl font-bold mt-2 font-code" suppressHydrationWarning>r00t_R3b3lz Admin</h1>
          </div>
          <Card suppressHydrationWarning>
            <CardHeader>
              <CardTitle>Admin Access</CardTitle>
              <CardDescription>Enter your credentials to manage content.</CardDescription>
            </CardHeader>
            <form action={dispatch}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    required
                    suppressHydrationWarning
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    required
                    suppressHydrationWarning
                  />
                </div>
                {errorMessage && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
              <CardFooter>
                <LoginButton />
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
}