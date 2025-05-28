import React from 'react';
import { useParams } from 'react-router-dom';
import UserDetails from '@/components/users/UserDetails';

const UserDetailsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();

  if (!userId) {
    return <div>User ID not provided</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">User Details</h1>
      <UserDetails />
    </div>
  );
};

export default UserDetailsPage;
