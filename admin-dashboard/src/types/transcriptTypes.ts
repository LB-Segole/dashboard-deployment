export interface TranscriptSegment {
  id: string;
  speaker: 'agent' | 'customer';
  text: string;
  timestamp: number;
  confidence: number;
  duration: number;
} 