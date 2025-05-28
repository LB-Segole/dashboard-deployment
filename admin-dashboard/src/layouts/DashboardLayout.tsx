import React from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

const DashboardLayout: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex h-screen">
                <AdminSidebar />
                
                <div className="flex-1 flex flex-col overflow-hidden">
                    <AdminHeader />
                    
                    <main className="flex-1 overflow-auto">
                        <div className="px-6 py-6">
                            <Breadcrumbs />
                            <div className="mt-6">
                                <Outlet />
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
