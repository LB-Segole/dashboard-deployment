import React from 'react';
import AdminLogin from '@/components/auth/AdminLogin';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <AdminLogin />
    </div>
  );
};

export default LoginPage;
