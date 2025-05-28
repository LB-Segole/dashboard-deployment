// utils/chartHelpers.ts
import { CallAnalytics, AgentPerformance } from '@/types/dashboard';

export const prepareCallVolumeChartData = (analytics: CallAnalytics) => {
  if (!analytics.byHour && !analytics.byDay) return null;

  const labels = analytics.byHour 
    ? analytics.byHour.map(item => item.hour)
    : analytics.byDay?.map(item => item.day) || [];

  const data = analytics.byHour
    ? analytics.byHour.map(item => item.count)
    : analytics.byDay?.map(item => item.count) || [];

  return {
    labels,
    datasets: [
      {
        label: analytics.byHour ? 'Calls by Hour' : 'Calls by Day',
        data,
        backgroundColor: '#2563eb',
        borderColor: '#1d4ed8',
        borderWidth: 1,
      },
    ],
  };
};

export const prepareAgentPerformanceChartData = (agents: AgentPerformance[]) => {
  const sortedAgents = [...agents].sort((a, b) => b.callsHandled - a.callsHandled).slice(0, 5);

  return {
    labels: sortedAgents.map(agent => agent.agentName),
    datasets: [
      {
        label: 'Calls Handled',
        data: sortedAgents.map(agent => agent.callsHandled),
        backgroundColor: '#2563eb',
      },
      {
        label: 'Satisfaction Score',
        data: sortedAgents.map(agent => agent.customerSatisfaction * 100),
        backgroundColor: '#10b981',
      },
    ],
  };
};

export const prepareSatisfactionChartData = (calls: Array<{ satisfactionScore?: number }>) => {
  const scores = {
    positive: 0,
    neutral: 0,
    negative: 0,
  };

  calls.forEach(call => {
    if (call.satisfactionScore === undefined) return;
    
    if (call.satisfactionScore >= 4) scores.positive++;
    else if (call.satisfactionScore >= 2) scores.neutral++;
    else scores.negative++;
  });

  return {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [scores.positive, scores.neutral, scores.negative],
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
      },
    ],
  };
};

export const CHART_OPTIONS = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          let label = context.dataset.label || '';
          if (label) label += ': ';
          if (context.parsed.y !== null) {
            label += context.parsed.y;
          }
          return label;
        },
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
};