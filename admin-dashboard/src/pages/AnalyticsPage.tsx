import React from 'react';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';

const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <AnalyticsDashboard />
    </div>
  );
};

export default AnalyticsPage;
