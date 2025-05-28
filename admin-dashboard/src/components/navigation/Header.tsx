import React from 'react';
import { Link } from 'react-router-dom';
import { Icons } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { useAdminAuth } from '@/hooks/useAdminAuth';

export function Header() {
  const { admin, logout } = useAdminAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <Icons.shield className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              AI Voice Calling
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="flex items-center">
            {admin && (
              <div className="flex items-center space-x-4">
                <p className="text-sm">
                  <span className="text-muted-foreground">Logged in as </span>
                  <span className="font-medium">{admin.name}</span>
                </p>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <Icons.close className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            )}
            {!admin && (
              <Button asChild size="sm">
                <Link to="/login">
                  <Icons.check className="mr-2 h-4 w-4" />
                  Login
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 