import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
            <div className="container mx-auto px-4 h-full">
                <Outlet />
            </div>
        </div>
    );
};

export default AuthLayout;
