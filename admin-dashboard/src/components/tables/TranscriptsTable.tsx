import React, { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Eye, Download, Search } from 'lucide-react';

interface Transcript {
  id: string;
  callId: string;
  userId: string;
  userEmail: string;
  agentName: string;
  duration: number;
  confidence: number;
  language: string;
  status: 'completed' | 'processing' | 'failed';
  createdAt: string;
  wordCount: number;
  sentiment: 'positive' | 'negative' | 'neutral';
}

interface TranscriptsTableProps {
  transcripts: Transcript[];
  onView?: (transcript: Transcript) => void;
  onDownload?: (transcript: Transcript) => void;
}

export const TranscriptsTable: React.FC<TranscriptsTableProps> = ({
  transcripts,
  onView,
  onDownload
}) => {
  const [sortField, setSortField] = useState<keyof Transcript>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const sortedTranscripts = [...transcripts].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: keyof Transcript) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status: Transcript['status']) => {
    const variants: Record<Transcript['status'], 'default' | 'success' | 'warning' | 'destructive'> = {
      completed: 'success',
      processing: 'warning',
      failed: 'destructive'
    };
    
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getSentimentBadge = (sentiment: Transcript['sentiment']) => {
    const variants: Record<Transcript['sentiment'], 'default' | 'success' | 'destructive'> = {
      positive: 'success',
      negative: 'destructive',
      neutral: 'default'
    };
    
    return <Badge variant={variants[sentiment]}>{sentiment}</Badge>;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Call ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Agent</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('createdAt')}
            >
              Created {sortField === 'createdAt' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('duration')}
            >
              Duration {sortField === 'duration' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('confidence')}
            >
              Confidence {sortField === 'confidence' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Words</TableHead>
            <TableHead>Sentiment</TableHead>
            <TableHead 
              className="cursor-pointer hover:bg-gray-100"
              onClick={() => handleSort('status')}
            >
              Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTranscripts.map((transcript) => (
            <TableRow key={transcript.id}>
              <TableCell>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {transcript.callId.slice(0, 8)}...
                </code>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{transcript.userEmail}</div>
                  <div className="text-sm text-gray-500">ID: {transcript.userId}</div>
                </div>
              </TableCell>
              <TableCell>{transcript.agentName}</TableCell>
              <TableCell>
                {new Date(transcript.createdAt).toLocaleString()}
              </TableCell>
              <TableCell>{formatDuration(transcript.duration)}</TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <span>{Math.round(transcript.confidence * 100)}%</span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${transcript.confidence * 100}%` }}
                    />
                  </div>
                </div>
              </TableCell>
              <TableCell>{transcript.language}</TableCell>
              <TableCell>{transcript.wordCount.toLocaleString()}</TableCell>
              <TableCell>{getSentimentBadge(transcript.sentiment)}</TableCell>
              <TableCell>{getStatusBadge(transcript.status)}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  {onView && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onView(transcript)}
                      title="View Transcript"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                  {transcript.status === 'completed' && onDownload && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDownload(transcript)}
                      title="Download Transcript"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {transcripts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No transcripts found</p>
        </div>
      )}
    </div>
  );
};

export default TranscriptsTable;
