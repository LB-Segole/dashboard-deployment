// utils/exportUtils.ts
import { formatDate, capitalize } from './adminHelpers';
import type { Call, AgentPerformance } from '@/types/dashboard';

export const exportToCSV = (data: any[], filename: string): void => {
  const csvContent = convertToCSV(data);
  downloadFile(csvContent, filename, 'text/csv');
};

export const exportToJSON = (data: any[], filename: string): void => {
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
};

export const exportCallsToExcel = (calls: Call[]): void => {
  const formattedCalls = calls.map(call => ({
    'Call ID': call.id,
    'Caller Number': call.callerNumber,
    'Caller Name': call.callerName || 'N/A',
    'Agent': call.agentName,
    'Status': capitalize(call.status),
    'Direction': capitalize(call.direction),
    'Duration (s)': call.duration || 0,
    'Started At': formatDate(call.startedAt),
    'Ended At': call.endedAt ? formatDate(call.endedAt) : 'N/A',
    'Recording Available': call.recordingAvailable ? 'Yes' : 'No',
    'Transcript Available': call.transcriptAvailable ? 'Yes' : 'No',
    'Satisfaction Score': call.satisfactionScore || 'N/A',
  }));

  exportToCSV(formattedCalls, `calls-export-${new Date().toISOString().split('T')[0]}.csv`);
};

export const exportAgentPerformance = (agents: AgentPerformance[]): void => {
  const formattedData = agents.map(agent => ({
    'Agent Name': agent.agentName,
    'Calls Handled': agent.callsHandled,
    'Average Handle Time (s)': agent.averageHandleTime.toFixed(2),
    'First Call Resolution (%)': (agent.firstCallResolution * 100).toFixed(2),
    'Customer Satisfaction (%)': (agent.customerSatisfaction * 100).toFixed(2),
    'Availability (%)': (agent.availability * 100).toFixed(2),
  }));

  exportToCSV(formattedData, `agent-performance-${new Date().toISOString().split('T')[0]}.csv`);
};

const convertToCSV = (data: any[]): string => {
  const headers = Object.keys(data[0] || {});
  const rows = data.map(row => 
    headers.map(fieldName => JSON.stringify(row[fieldName] || '')).join(',')
  );
  return [headers.join(','), ...rows].join('\n');
};

const downloadFile = (content: string, filename: string, type: string): void => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};