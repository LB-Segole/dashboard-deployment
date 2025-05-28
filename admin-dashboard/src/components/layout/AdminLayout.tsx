import React, { useState } from 'react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import Breadcrumbs from './Breadcrumbs';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <AdminSidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader onMenuToggle={toggleSidebar} />
          
          <main className="flex-1 overflow-auto">
            <div className="px-6 py-6">
              <Breadcrumbs />
              <div className="mt-6">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;