// components/users/UserList.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, Shield, ChevronRight } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'manager' | 'agent';
  status: 'active' | 'suspended';
  lastLogin: string;
}

interface UserListProps {
  searchQuery: string;
  roleFilter: string;
}

const UserList: React.FC<UserListProps> = ({ searchQuery, roleFilter }) => {
  // Simulated data - in a real app, this would come from an API
  const users: User[] = [
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@voiceai.com',
      phone: '+1 (555) 123-4567',
      role: 'admin',
      status: 'active',
      lastLogin: '2023-11-15T14:30:00Z'
    },
    {
      id: '2',
      name: 'Manager One',
      email: 'manager1@voiceai.com',
      phone: '+1 (555) 234-5678',
      role: 'manager',
      status: 'active',
      lastLogin: '2023-11-14T10:15:00Z'
    },
    {
      id: '3',
      name: 'Agent Smith',
      email: 'agent.smith@voiceai.com',
      phone: '+1 (555) 345-6789',
      role: 'agent',
      status: 'active',
      lastLogin: '2023-11-13T08:45:00Z'
    },
    {
      id: '4',
      name: 'Suspended User',
      email: 'suspended@voiceai.com',
      phone: '+1 (555) 456-7890',
      role: 'agent',
      status: 'suspended',
      lastLogin: '2023-10-30T16:20:00Z'
    },
  ];

  // Filter users based on search query and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="overflow-hidden">
      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Link
              key={user.id}
              to={`/users/${user.id}`}
              className="group hover:bg-gray-50 transition-colors duration-150"
            >
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-150">
                      {user.name}
                    </h3>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="inline-flex items-center text-sm text-gray-500">
                        <Mail className="w-4 h-4 mr-1" />
                        {user.email}
                      </span>
                      <span className="inline-flex items-center text-sm text-gray-500">
                        <Phone className="w-4 h-4 mr-1" />
                        {user.phone}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center">
                    <Shield className={`w-4 h-4 mr-2 ${
                      user.role === 'admin' ? 'text-purple-600' : 
                      user.role === 'manager' ? 'text-blue-600' : 'text-gray-600'
                    }`} />
                    <span className="text-sm font-medium capitalize">{user.role}</span>
                  </div>
                  <div className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-150" />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No users found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;