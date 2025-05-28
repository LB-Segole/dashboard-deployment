import React, { useState, useEffect, useRef } from 'react';
import { Search, Download, Play, Pause, Clock, User, Bot } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';

export interface TranscriptSegment {
  id: string;
  speaker: 'agent' | 'customer';
  text: string;
  timestamp: number;
  confidence: number;
  duration: number;
}

interface TranscriptViewerProps {
  callId: string;
  transcript?: TranscriptSegment[];
  audioUrl?: string;
  isLoading?: boolean;
  onTimestampClick?: (timestamp: number) => void;
}

export const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  callId,
  transcript = [],
  audioUrl,
  isLoading = false,
  onTimestampClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedSegments, setHighlightedSegments] = useState<Set<string>>(new Set());
  const [currentPlayingSegment, setCurrentPlayingSegment] = useState<string | null>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);

  // Mock transcript data if none provided
  const mockTranscript: TranscriptSegment[] = [
    {
      id: '1',
      speaker: 'agent',
      text: 'Hello! Thank you for calling AI Voice Solutions. My name is Sarah, and I\'m here to help you today. How can I assist you?',
      timestamp: 0,
      confidence: 0.98,
      duration: 6.2
    },
    {
      id: '2',
      speaker: 'customer',
      text: 'Hi Sarah, I\'m interested in learning more about your AI voice calling agent solution for my business.',
      timestamp: 7.1,
      confidence: 0.95,
      duration: 4.8
    },
    {
      id: '3',
      speaker: 'agent',
      text: 'That\'s wonderful! I\'d be happy to tell you about our AI voice calling platform. Can you tell me a bit about your business and what you\'re hoping to achieve?',
      timestamp: 12.5,
      confidence: 0.97,
      duration: 7.3
    },
    {
      id: '4',
      speaker: 'customer',
      text: 'We\'re a real estate agency with about 50 agents. We make hundreds of calls daily for lead follow-ups and customer service. We\'re looking to automate some of these processes.',
      timestamp: 20.8,
      confidence: 0.92,
      duration: 8.9
    },
    {
      id: '5',
      speaker: 'agent',
      text: 'Perfect! Our solution is ideal for real estate agencies. Our AI can handle lead qualification, appointment scheduling, and follow-up calls. It integrates seamlessly with popular CRM systems and can be customized to match your brand voice.',
      timestamp: 30.2,
      confidence: 0.96,
      duration: 12.1
    }
  ];

  const displayTranscript = transcript.length > 0 ? transcript : mockTranscript;

  useEffect(() => {
    if (searchTerm) {
      const matches = new Set<string>();
      displayTranscript.forEach(segment => {
        if (segment.text.toLowerCase().includes(searchTerm.toLowerCase())) {
          matches.add(segment.id);
        }
      });
      setHighlightedSegments(matches);
    } else {
      setHighlightedSegments(new Set());
    }
  }, [searchTerm, displayTranscript]);

  const formatTimestamp = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleTimestampClick = (timestamp: number, segmentId: string) => {
    setCurrentPlayingSegment(segmentId);
    onTimestampClick?.(timestamp);
  };

  const downloadTranscript = () => {
    const transcriptText = displayTranscript
      .map(segment => `[${formatTimestamp(segment.timestamp)}] ${segment.speaker.toUpperCase()}: ${segment.text}`)
      .join('\n\n');

    const blob = new Blob([transcriptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transcript_${callId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.toLowerCase() === searchTerm.toLowerCase()) {
        return (
          <mark key={index} className="bg-yellow-200 px-1 rounded">
            {part}
          </mark>
        );
      }
      return part;
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.95) return 'bg-green-100 text-green-800';
    if (confidence >= 0.85) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-lg font-medium">Loading transcript...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search transcript..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="px-3 py-1">
            {displayTranscript.length} segments
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadTranscript}
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </Button>
        </div>
      </div>

      {/* Transcript Content */}
      <Card className="p-0 max-h-96 overflow-y-auto">
        <div ref={transcriptRef} className="space-y-0">
          {displayTranscript.map((segment, index) => (
            <div
              key={segment.id}
              className={`p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${
                highlightedSegments.has(segment.id) ? 'bg-yellow-50' : ''
              } ${currentPlayingSegment === segment.id ? 'bg-blue-50' : ''}`}
            >
              <div className="flex items-start space-x-3">
                {/* Speaker Icon */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  segment.speaker === 'agent' ? 'bg-blue-100' : 'bg-green-100'
                }`}>
                  {segment.speaker === 'agent' ? (
                    <Bot className="h-4 w-4 text-blue-600" />
                  ) : (
                    <User className="h-4 w-4 text-green-600" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-sm capitalize">
                      {segment.speaker === 'agent' ? 'AI Agent' : 'Customer'}
                    </span>
                    <button
                      onClick={() => handleTimestampClick(segment.timestamp, segment.id)}
                      className="inline-flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-600 transition-colors"
                    >
                      <Clock className="h-3 w-3" />
                      <span>{formatTimestamp(segment.timestamp)}</span>
                    </button>
                    <Badge 
                      className={`text-xs ${getConfidenceColor(segment.confidence)}`}
                      variant="secondary"
                    >
                      {(segment.confidence * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  
                  <p className="text-gray-800 leading-relaxed">
                    {highlightText(segment.text, searchTerm)}
                  </p>
                  
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <span>Duration: {segment.duration.toFixed(1)}s</span>
                    {audioUrl && (
                      <button
                        onClick={() => handleTimestampClick(segment.timestamp, segment.id)}
                        className="inline-flex items-center space-x-1 hover:text-blue-600 transition-colors"
                      >
                        {currentPlayingSegment === segment.id ? (
                          <Pause className="h-3 w-3" />
                        ) : (
                          <Play className="h-3 w-3" />
                        )}
                        <span>Play</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {displayTranscript.filter(s => s.speaker === 'agent').length}
            </div>
            <div className="text-sm text-gray-600">Agent Messages</div>
          </div>
        </Card>
        
        <Card className="p-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {displayTranscript.filter(s => s.speaker === 'customer').length}
            </div>
            <div className="text-sm text-gray-600">Customer Messages</div>
          </div>
        </Card>
        
        <Card className="p-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {displayTranscript.length > 0
                ? ((displayTranscript.reduce((sum, s) => sum + s.confidence, 0) / displayTranscript.length) * 100).toFixed(0)
                : '0'}%
            </div>
            <div className="text-sm text-gray-600">Avg Confidence</div>
          </div>
        </Card>
        
        <Card className="p-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {displayTranscript.length > 0
                ? formatTimestamp(Math.max(...displayTranscript.map(s => s.timestamp + s.duration)))
                : '0:00'}
            </div>
            <div className="text-sm text-gray-600">Total Duration</div>
          </div>
        </Card>
      </div>
    </div>
  );
};