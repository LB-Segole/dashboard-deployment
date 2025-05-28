import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCallAnalysis } from '@/hooks/useCallAnalysis';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icons } from '@/components/Icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Badge } from '@/components/ui/Badge';

export const CallAnalysis = () => {
  const { callId } = useParams();
  const { analysis, loading, error } = useCallAnalysis(callId || '');
  const [activeTab, setActiveTab] = useState<'sentiment' | 'topics' | 'metrics'>('sentiment');

  if (!callId) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center text-gray-800">
          <Icons.info className="h-5 w-5 mr-2" />
          <h3 className="font-medium">No call selected</h3>
        </div>
        <p className="mt-2 text-sm text-gray-600">
          Please select a call from the call history to view analysis
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Icons.spinner className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-center text-red-800">
          <Icons.alertCircle className="h-5 w-5 mr-2" />
          <h3 className="font-medium">Error loading call analysis</h3>
        </div>
        <p className="mt-2 text-sm text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Call Analysis</h2>
        <div className="flex space-x-2">
          <Button
            variant={activeTab === 'sentiment' ? 'default' : 'outline'}
            onClick={() => setActiveTab('sentiment')}
          >
            Sentiment
          </Button>
          <Button
            variant={activeTab === 'topics' ? 'default' : 'outline'}
            onClick={() => setActiveTab('topics')}
          >
            Topics
          </Button>
          <Button
            variant={activeTab === 'metrics' ? 'default' : 'outline'}
            onClick={() => setActiveTab('metrics')}
          >
            Metrics
          </Button>
        </div>
      </div>

      {activeTab === 'sentiment' && (
        <Card>
          <CardHeader>
            <CardTitle>Sentiment Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analysis?.sentimentOverTime}>
                  <XAxis dataKey="time" />
                  <YAxis domain={[-1, 1]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sentiment" fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium">Overall Sentiment</h4>
                <div className="mt-2 flex items-center">
                  <Badge
                    variant={
                      analysis?.overallSentiment.score > 0.3
                        ? 'positive'
                        : analysis?.overallSentiment.score < -0.3
                        ? 'negative'
                        : 'neutral'
                    }
                  >
                    {analysis?.overallSentiment.label}
                  </Badge>
                  <span className="ml-2 text-sm text-gray-600">
                    ({analysis?.overallSentiment.score.toFixed(2)})
                  </span>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium">Customer Sentiment</h4>
                <div className="mt-2 flex items-center">
                  <Badge
                    variant={
                      analysis?.customerSentiment.score > 0.3
                        ? 'positive'
                        : analysis?.customerSentiment.score < -0.3
                        ? 'negative'
                        : 'neutral'
                    }
                  >
                    {analysis?.customerSentiment.label}
                  </Badge>
                  <span className="ml-2 text-sm text-gray-600">
                    ({analysis?.customerSentiment.score.toFixed(2)})
                  </span>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium">Agent Sentiment</h4>
                <div className="mt-2 flex items-center">
                  <Badge
                    variant={
                      analysis?.agentSentiment.score > 0.3
                        ? 'positive'
                        : analysis?.agentSentiment.score < -0.3
                        ? 'negative'
                        : 'neutral'
                    }
                  >
                    {analysis?.agentSentiment.label}
                  </Badge>
                  <span className="ml-2 text-sm text-gray-600">
                    ({analysis?.agentSentiment.score.toFixed(2)})
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'topics' && (
        <Card>
          <CardHeader>
            <CardTitle>Topics Detected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysis?.topics.map((topic) => (
                <div key={topic.topic} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">{topic.topic}</h4>
                    <Badge>{topic.count} mentions</Badge>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Relevance: {(topic.relevance * 100).toFixed(0)}%
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'metrics' && (
        <Card>
          <CardHeader>
            <CardTitle>Call Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-medium">Talk/Listen Ratio</h4>
                <div className="mt-2">
                  <p className="text-2xl font-bold">
                    {analysis?.metrics.talkListenRatio.toFixed(2)}:1
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {analysis?.metrics.talkListenRatio > 1.5
                      ? 'Agent dominated conversation'
                      : analysis?.metrics.talkListenRatio < 0.7
                      ? 'Customer dominated conversation'
                      : 'Balanced conversation'}
                  </p>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium">Interruptions</h4>
                <div className="mt-2">
                  <p className="text-2xl font-bold">
                    {analysis?.metrics.interruptions}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {analysis?.metrics.interruptionsPerMinute.toFixed(1)} per minute
                  </p>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-medium">Silence Percentage</h4>
                <div className="mt-2">
                  <p className="text-2xl font-bold">
                    {analysis?.metrics.silencePercentage.toFixed(1)}%
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {analysis?.metrics.silencePercentage > 15
                      ? 'Higher than average'
                      : 'Normal'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};