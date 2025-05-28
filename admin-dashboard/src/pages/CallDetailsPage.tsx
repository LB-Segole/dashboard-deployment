import React from 'react';
import { useParams } from 'react-router-dom';
import CallDetails from '@/components/calls/CallDetails';

const CallDetailsPage: React.FC = () => {
  const { callId } = useParams<{ callId: string }>();

  if (!callId) {
    return <div>Call ID not provided</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Call Details</h1>
      <CallDetails />
    </div>
  );
};

export default CallDetailsPage;
