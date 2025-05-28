import { CallStats } from './CallStats';
import { CallHistory } from './CallHistory';
import { RecentCalls } from './RecentCalls';
import { QuickActions } from './QuickActions';

export function UserDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            New Call
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            Schedule
          </button>
        </div>
      </div>
      
      <CallStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentCalls />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="font-semibold text-lg mb-4">Performance</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
              Analytics Chart Placeholder
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}