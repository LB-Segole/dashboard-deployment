import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAgent } from '../hooks/useAgents';
import { Call } from '../types';

export const Calls: React.FC = () => {
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);
  const { config } = useAgent({
    id: 'default',
    websocketUrl: process.env.NEXT_PUBLIC_WS_URL || '',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || '',
    authToken: '',
    voice: 'en-US-Standard-A',
    speakingRate: 1,
    pitch: 0,
    language: 'en-US'
  });

  const { data: calls, isLoading } = useQuery<Call[]>({
    queryKey: ['calls'],
    queryFn: async () => {
      const response = await fetch(`${config.apiUrl}/calls`, {
        headers: {
          Authorization: `Bearer ${config.authToken}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch calls');
      }
      return response.json();
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Calls</h1>
          <button
            onClick={() => {/* Implement new call logic */}}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            New Call
          </button>
        </div>

        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        ID
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Start Time
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Duration
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Participants
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {calls?.map((call) => (
                      <tr
                        key={call.id}
                        onClick={() => setSelectedCall(call)}
                        className="cursor-pointer hover:bg-gray-50"
                      >
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {call.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            call.status === 'active' ? 'bg-green-100 text-green-800' :
                            call.status === 'ended' ? 'bg-gray-100 text-gray-800' :
                            call.status === 'error' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {call.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(call.startTime).toLocaleString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {call.endTime ? 
                            `${Math.round((new Date(call.endTime).getTime() - new Date(call.startTime).getTime()) / 1000 / 60)}m` :
                            'Ongoing'
                          }
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {call.participants.join(', ')}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Implement view details logic
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            View details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};