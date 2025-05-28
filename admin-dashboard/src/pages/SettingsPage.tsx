import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import SystemSettings from '@/components/settings/SystemSettings';
import UserSettings from '@/components/settings/UserSettings';
import APISettings from '@/components/settings/APISettings';

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Settings</h1>
      <Tabs defaultValue="system" className="w-full">
        <TabsList>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="user">User</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
        </TabsList>
        <TabsContent value="system">
          <SystemSettings />
        </TabsContent>
        <TabsContent value="user">
          <UserSettings />
        </TabsContent>
        <TabsContent value="api">
          <APISettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
