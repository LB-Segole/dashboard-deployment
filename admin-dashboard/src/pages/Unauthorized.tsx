// components/auth/Unauthorized.tsx
import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';

const Unauthorized: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-red-600 p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <ShieldAlert className="h-6 w-6 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-white mt-3">Unauthorized Access</h1>
        </div>

        <div className="p-6 text-center">
          <p className="text-gray-700 mb-6">
            You don&apos;t have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>

          <div className="flex flex-col space-y-3">
            <Button asChild variant="outline">
              <Link to="/" className="flex items-center justify-center">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Return to Home
              </Link>
            </Button>

            <Button asChild>
              <Link to="/login" className="flex items-center justify-center">
                Sign in with a different account
              </Link>
            </Button>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Need help? Contact our <a href="#" className="text-blue-600 hover:text-blue-500">support team</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;