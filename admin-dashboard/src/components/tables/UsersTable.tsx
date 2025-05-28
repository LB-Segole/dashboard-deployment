import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { User } from '@/types/admin';
import { Icons } from '@/components/ui/Icons';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';

interface UsersTableProps {
  users: User[];
  loading: boolean;
  error: string | null;
}

type SortableFields = 'name' | 'email' | 'role' | 'status' | 'lastLogin';
type SortDirection = 'asc' | 'desc';

const sortData = (
  data: User[],
  sortField: SortableFields,
  sortDirection: SortDirection
): User[] => {
  return [...data].sort((a, b) => {
    let aValue: string | number | Date | undefined;
    let bValue: string | number | Date | undefined;

    switch (sortField) {
      case 'name':
        aValue = a.name?.toLowerCase();
        bValue = b.name?.toLowerCase();
        break;
      case 'email':
        aValue = a.email?.toLowerCase();
        bValue = b.email?.toLowerCase();
        break;
      case 'role':
        aValue = a.role;
        bValue = b.role;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'lastLogin':
        aValue = a.lastLogin ? new Date(a.lastLogin) : new Date(0);
        bValue = b.lastLogin ? new Date(b.lastLogin) : new Date(0);
        break;
      default:
        return 0;
    }

    if (aValue === undefined || bValue === undefined) return 0;
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
};

export const UsersTable: React.FC<UsersTableProps> = ({
  users,
  loading,
  error,
}) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortableFields>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortableFields) => {
    if (field === sortField) {
      setSortDirection(current => (current === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <Icons.spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-red-500">
        <Icons.alertCircle className="h-5 w-5 mr-2" />
        {error}
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="min-h-[200px] flex items-center justify-center text-gray-500">
        No users found
      </div>
    );
  }

  const sortedUsers = sortData(users, sortField, sortDirection);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead
            className="cursor-pointer"
            onClick={() => handleSort('name')}
          >
            Name {sortField === 'name' && (
              <Icons.chevronDown
                className={`inline h-4 w-4 transition-transform ${
                  sortDirection === 'desc' ? 'rotate-180' : ''
                }`}
              />
            )}
          </TableHead>
          <TableHead
            className="cursor-pointer"
            onClick={() => handleSort('email')}
          >
            Email {sortField === 'email' && (
              <Icons.chevronDown
                className={`inline h-4 w-4 transition-transform ${
                  sortDirection === 'desc' ? 'rotate-180' : ''
                }`}
              />
            )}
          </TableHead>
          <TableHead
            className="cursor-pointer"
            onClick={() => handleSort('role')}
          >
            Role {sortField === 'role' && (
              <Icons.chevronDown
                className={`inline h-4 w-4 transition-transform ${
                  sortDirection === 'desc' ? 'rotate-180' : ''
                }`}
              />
            )}
          </TableHead>
          <TableHead
            className="cursor-pointer"
            onClick={() => handleSort('status')}
          >
            Status {sortField === 'status' && (
              <Icons.chevronDown
                className={`inline h-4 w-4 transition-transform ${
                  sortDirection === 'desc' ? 'rotate-180' : ''
                }`}
              />
            )}
          </TableHead>
          <TableHead
            className="cursor-pointer"
            onClick={() => handleSort('lastLogin')}
          >
            Last Login {sortField === 'lastLogin' && (
              <Icons.chevronDown
                className={`inline h-4 w-4 transition-transform ${
                  sortDirection === 'desc' ? 'rotate-180' : ''
                }`}
              />
            )}
          </TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedUsers.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.name}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>
              <Badge variant="outline">{user.role}</Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  user.status === 'active'
                    ? 'positive'
                    : user.status === 'suspended'
                    ? 'negative'
                    : 'neutral'
                }
              >
                {user.status}
              </Badge>
            </TableCell>
            <TableCell>
              {user.lastLogin
                ? format(new Date(user.lastLogin), 'MMM d, yyyy HH:mm')
                : 'Never'}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/users/${user.id}`)}
              >
                View Details
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};