/**
 * useApi Hook
 * Custom hook for making API requests with built-in loading and error states
 */

import { useState } from 'react';
import { httpClient } from '../services/apiclient';
import { ErrorCodes } from '../constants/errorcodes';

type ApiFunction<T> = () => Promise<T>;

export const useApi = <T,>() => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const callApi = async (apiFunction: ApiFunction<T>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunction();
      setData(response);
      return response;
    } catch (err: any) {
      const errorCode = err.response?.data?.code || ErrorCodes.SERVER_ERROR;
      setError(errorCode);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, callApi };
};