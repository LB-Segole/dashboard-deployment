import React from 'react';
import { Card } from '@/components/ui/card';
import { useCallAnalytics } from '@/hooks/useCallAnalytics';
import { Spinner } from '@/components/ui/Spinner';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface CallAnalyticsProps {
  callId: string;
}

interface CallAnalyticsData {
  sentimentScore: number;
  customerSatisfaction: number;
  resolutionTime: number;
  conversationFlow: Array<{
    name: string;
    duration: number;
  }>;
  insights: string[];
}

export const CallAnalytics: React.FC<CallAnalyticsProps> = ({ callId }) => {
  const { data, loading, error } = useCallAnalytics(callId);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-gray-700">No analytics data available</p>
      </div>
    );
  }

  const analyticsData = data as CallAnalyticsData;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h4 className="text-sm font-medium text-gray-500">Sentiment Score</h4>
          <p className="mt-2 text-2xl font-semibold">
            {analyticsData.sentimentScore.toFixed(2)}
          </p>
        </Card>

        <Card className="p-4">
          <h4 className="text-sm font-medium text-gray-500">Customer Satisfaction</h4>
          <p className="mt-2 text-2xl font-semibold">
            {analyticsData.customerSatisfaction}/10
          </p>
        </Card>

        <Card className="p-4">
          <h4 className="text-sm font-medium text-gray-500">Resolution Time</h4>
          <p className="mt-2 text-2xl font-semibold">
            {analyticsData.resolutionTime} seconds
          </p>
        </Card>
      </div>

      <Card className="p-4">
        <h4 className="text-sm font-medium text-gray-500 mb-4">
          Conversation Flow
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData.conversationFlow}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="duration" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <h4 className="text-sm font-medium text-gray-500 mb-4">Key Insights</h4>
        <ul className="space-y-2">
          {analyticsData.insights.map((insight: string, index: number) => (
            <li key={index} className="flex items-start">
              <span className="inline-block w-2 h-2 mt-2 mr-2 bg-blue-500 rounded-full" />
              <span className="text-gray-700">{insight}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}; 