import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Clock, Mic, Brain, AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';

interface CallAnalysisData {
  id: string;
  duration: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
  keywords: string[];
  emotions: Array<{
    emotion: string;
    intensity: number;
    timestamp: number;
  }>;
  speaking_time: {
    agent: number;
    customer: number;
  };
  interruptions: number;
  silence_periods: Array<{
    start: number;
    duration: number;
  }>;
  quality_score: number;
  transcription_accuracy: number;
}

interface CallAnalyzerProps {
  callId: string;
  analysisData?: CallAnalysisData;
  onAnalysisComplete?: (data: CallAnalysisData) => void;
}

const EMOTION_COLORS = {
  happy: '#10B981',
  sad: '#EF4444',
  angry: '#F59E0B',
  neutral: '#6B7280',
  excited: '#8B5CF6',
  frustrated: '#DC2626'
};

export const CallAnalyzer: React.FC<CallAnalyzerProps> = ({
  callId,
  analysisData,
  onAnalysisComplete
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<CallAnalysisData | null>(analysisData || null);

  useEffect(() => {
    if (!analysisData && callId) {
      analyzeCall();
    }
  }, [callId, analysisData]);

  const analyzeCall = async () => {
    setIsAnalyzing(true);
    try {
      // Simulate API call to analyze the call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const mockAnalysis: CallAnalysisData = {
        id: callId,
        duration: 245,
        sentiment: 'positive',
        confidence: 0.87,
        keywords: ['pricing', 'features', 'demo', 'integration', 'support'],
        emotions: [
          { emotion: 'neutral', intensity: 0.6, timestamp: 0 },
          { emotion: 'happy', intensity: 0.8, timestamp: 60 },
          { emotion: 'excited', intensity: 0.9, timestamp: 120 },
          { emotion: 'neutral', intensity: 0.7, timestamp: 180 },
        ],
        speaking_time: { agent: 145, customer: 100 },
        interruptions: 3,
        silence_periods: [
          { start: 45, duration: 2.5 },
          { start: 123, duration: 1.8 },
          { start: 201, duration: 3.2 }
        ],
        quality_score: 8.5,
        transcription_accuracy: 0.94
      };

      setAnalysis(mockAnalysis);
      onAnalysisComplete?.(mockAnalysis);
    } catch (error) {
      console.error('Failed to analyze call:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isAnalyzing) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-lg font-medium">Analyzing call...</span>
        </div>
        <div className="mt-4 space-y-2">
          <div className="text-sm text-gray-600">Processing audio transcription...</div>
          <div className="text-sm text-gray-600">Analyzing sentiment and emotions...</div>
          <div className="text-sm text-gray-600">Generating insights...</div>
        </div>
      </Card>
    );
  }

  if (!analysis) {
    return (
      <Card className="p-6">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Analysis Available</h3>
          <p className="text-gray-600">Call analysis data is not available for this call.</p>
        </div>
      </Card>
    );
  }

  const emotionData = analysis.emotions.map(emotion => ({
    name: emotion.emotion,
    value: emotion.intensity,
    timestamp: emotion.timestamp
  }));

  const speakingTimeData = [
    { name: 'Agent', value: analysis.speaking_time.agent, fill: '#3B82F6' },
    { name: 'Customer', value: analysis.speaking_time.customer, fill: '#10B981' }
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Duration</p>
              <p className="text-xl font-semibold">{Math.floor(analysis.duration / 60)}m {analysis.duration % 60}s</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Sentiment</p>
              <Badge className={getSentimentColor(analysis.sentiment)}>
                {analysis.sentiment}
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Brain className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Quality Score</p>
              <p className={`text-xl font-semibold ${getQualityColor(analysis.quality_score)}`}>
                {analysis.quality_score}/10
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Mic className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Accuracy</p>
              <p className="text-xl font-semibold">{(analysis.transcription_accuracy * 100).toFixed(1)}%</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Analysis */}
      <Tabs defaultValue="emotions" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="emotions">Emotions</TabsTrigger>
          <TabsTrigger value="speaking">Speaking Time</TabsTrigger>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="emotions" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Emotion Timeline</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={emotionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="speaking" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Speaking Time Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={speakingTimeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {speakingTimeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">Agent Speaking Time</span>
                  <span className="text-blue-600 font-semibold">
                    {Math.floor(analysis.speaking_time.agent / 60)}m {analysis.speaking_time.agent % 60}s
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Customer Speaking Time</span>
                  <span className="text-green-600 font-semibold">
                    {Math.floor(analysis.speaking_time.customer / 60)}m {analysis.speaking_time.customer % 60}s
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium">Interruptions</span>
                  <span className="text-yellow-600 font-semibold">{analysis.interruptions}</span>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Key Topics Discussed</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.keywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {keyword}
                </Badge>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Call Insights</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Positive customer engagement</p>
                  <p className="text-sm text-gray-600">Customer showed high interest with positive sentiment throughout the call.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium">Good conversation flow</p>
                  <p className="text-sm text-gray-600">Minimal interruptions and appropriate speaking time distribution.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <p className="font-medium">Areas for improvement</p>
                  <p className="text-sm text-gray-600">Consider reducing silence periods to maintain engagement.</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};