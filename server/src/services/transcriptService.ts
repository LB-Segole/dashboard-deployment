import { prisma } from '../lib/prisma';
import { AppError } from '../errors/AppError';
import { DeepgramService } from './deepgram-service';

export const TranscriptService = {
  async createTranscript(callId: string, audioUrl: string) {
    const transcription = await DeepgramService.transcribeAudio(audioUrl);
    
    const transcript = await prisma.transcript.create({
      data: {
        callId,
        rawText: transcription.channels[0].alternatives[0].transcript,
        utterances: transcription.utterances,
        diarization: transcription.diarization
      }
    });

    return transcript;
  },

  async getTranscripts(userId: string, limit = 20, offset = 0) {
    return prisma.transcript.findMany({
      where: { call: { userId } },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: { call: { select: { phoneNumber: true, duration: true } } }
    });
  },

  async analyzeTranscript(transcriptId: string) {
    // Implementation would use OpenAI to analyze the transcript
  }
};