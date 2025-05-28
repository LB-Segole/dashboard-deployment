import ffmpeg from 'fluent-ffmpeg';
import { Readable } from 'stream';
import { AppError } from '../errors/AppError';

export class AudioUtils {
  static async convertToWav(input: Buffer | Readable): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Uint8Array[] = [];
      const command = ffmpeg(input)
        .audioCodec('pcm_s16le')
        .audioFrequency(16000)
        .audioChannels(1)
        .format('wav')
        .on('error', (err) => {
          reject(new AppError(`Audio conversion failed: ${err.message}`, 500));
        });

      const stream = command.pipe();
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  static calculateDuration(buffer: Buffer): number {
    // WAV file header contains duration information
    const byteRate = buffer.readUInt32LE(28);
    const dataSize = buffer.readUInt32LE(40);
    return dataSize / byteRate;
  }

  static normalizeAudioLevel(buffer: Buffer): Buffer {
    // Implementation for audio normalization
    return buffer;
  }
}