/**
 * Transcript Type Definitions
 */

export interface Transcript {
  id: string;
  callId: string;
  rawText: string;
  processedText: string;
  speakerCount: number;
  speakers: Array<{
    id: number;
    label?: string;
    duration: number;
    wordCount: number;
  }>;
  wordTimings: Array<{
    word: string;
    start: number;
    end: number;
    speaker: number;
    confidence: number;
  }>;
  sentiment?: {
    overall: number;
    bySpeaker: Record<number, number>;
    bySegment: Array<{
      start: number;
      end: number;
      sentiment: number;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type TranscriptSummary = {
  id: string;
  callId: string;
  summary: string;
  actionItems: string[];
  keywords: string[];
  createdAt: Date;
};