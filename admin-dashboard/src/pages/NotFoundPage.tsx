import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-xl">Page not found</p>
      <Button asChild>
        <Link to="/">Return to Dashboard</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
