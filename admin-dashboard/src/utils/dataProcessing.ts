// utils/dataProcessing.ts
import { Call, CallTranscript } from '@/types/dashboard';

export const filterCalls = (
  calls: Call[],
  filters: {
    status?: string;
    agentId?: string;
    dateRange?: { start: string; end: string };
    searchQuery?: string;
  }
): Call[] => {
  return calls.filter(call => {
    // Filter by status
    if (filters.status && call.status !== filters.status) return false;
    
    // Filter by agent
    if (filters.agentId && call.agentId !== filters.agentId) return false;
    
    // Filter by date range
    if (filters.dateRange) {
      const callDate = new Date(call.startedAt).getTime();
      const startDate = new Date(filters.dateRange.start).getTime();
      const endDate = new Date(filters.dateRange.end).getTime();
      
      if (callDate < startDate || callDate > endDate) return false;
    }
    
    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      const matchesCaller = call.callerNumber.toLowerCase().includes(query);
      const matchesAgent = call.agentName.toLowerCase().includes(query);
      
      if (!matchesCaller && !matchesAgent) return false;
    }
    
    return true;
  });
};

export const analyzeSentiment = (transcript: CallTranscript): {
  positive: number;
  neutral: number;
  negative: number;
} => {
  const result = { positive: 0, neutral: 0, negative: 0 };
  
  if (!transcript?.segments) return result;
  
  transcript.segments.forEach(segment => {
    if (segment.sentiment === 'positive') result.positive++;
    else if (segment.sentiment === 'neutral') result.neutral++;
    else if (segment.sentiment === 'negative') result.negative++;
  });
  
  return result;
};

export const calculateAverageHandleTime = (calls: Call[]): number => {
  const completedCalls = calls.filter(call => 
    call.status === 'completed' && call.duration
  );
  
  if (completedCalls.length === 0) return 0;
  
  const totalDuration = completedCalls.reduce(
    (sum, call) => sum + (call.duration || 0), 0
  );
  
  return totalDuration / completedCalls.length;
};

export const paginateData = <T>(
  data: T[],
  page: number,
  limit: number
): { data: T[]; total: number } => {
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: data.slice(start, end),
    total: data.length,
  };
};

export const sortByDate = <T extends { [key: string]: any }>(
  data: T[],
  dateField: string,
  direction: 'asc' | 'desc' = 'desc'
): T[] => {
  return [...data].sort((a, b) => {
    const dateA = new Date(a[dateField]).getTime();
    const dateB = new Date(b[dateField]).getTime();
    return direction === 'asc' ? dateA - dateB : dateB - dateA;
  });
};