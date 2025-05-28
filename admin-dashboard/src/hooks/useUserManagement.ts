import { useState } from 'react';
import { User, UserListResponse, UserCreatePayload } from '@/types/admin';
import { listUsers, getUser as getUserById, updateUser as updateUserApi, createUser as createUserApi } from '@/services/userService';

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async (page = 1, limit = 20, search = "") => {
    try {
      setLoading(true);
      const response = await listUsers(page, limit, search);
      setUsers(response.users);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getUser = async (id: string) => {
    try {
      setLoading(true);
      const user = await getUserById(id);
      setSelectedUser(user);
      return user;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, data: Partial<User>) => {
    try {
      setLoading(true);
      const updatedUser = await updateUserApi(id, data);
      setSelectedUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (data: UserCreatePayload) => {
    try {
      setLoading(true);
      const newUser = await createUserApi(data);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    selectedUser,
    loading,
    error,
    fetchUsers,
    getUser,
    updateUser,
    createUser,
    setSelectedUser,
  };
};