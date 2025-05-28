import React from 'react';
import CallsList from '@/components/calls/CallsList';

const CallsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Call History</h1>
      <CallsList />
    </div>
  );
};

export default CallsPage;
