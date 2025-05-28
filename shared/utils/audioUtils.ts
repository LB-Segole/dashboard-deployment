/**
 * Audio Processing Utilities
 */

export class AudioUtils {
  static normalizeVolume(audioBuffer: AudioBuffer): AudioBuffer {
    const channels = audioBuffer.numberOfChannels;
    const samples = audioBuffer.length;
    let max = 0;

    // Find the maximum peak across all channels
    for (let c = 0; c < channels; c++) {
      const channelData = audioBuffer.getChannelData(c);
      for (let i = 0; i < samples; i++) {
        const absValue = Math.abs(channelData[i]);
        if (absValue > max) max = absValue;
      }
    }

    // Normalize if we found a peak greater than 1
    if (max > 1) {
      const scale = 1 / max;
      for (let c = 0; c < channels; c++) {
        const channelData = audioBuffer.getChannelData(c);
        for (let i = 0; i < samples; i++) {
          channelData[i] *= scale;
        }
      }
    }

    return audioBuffer;
  }

  static convertSampleRate(
    audioBuffer: AudioBuffer,
    targetSampleRate: number
  ): AudioBuffer {
    const offlineCtx = new OfflineAudioContext(
      audioBuffer.numberOfChannels,
      (audioBuffer.length * targetSampleRate) / audioBuffer.sampleRate,
      targetSampleRate
    );
    const bufferSource = offlineCtx.createBufferSource();
    bufferSource.buffer = audioBuffer;
    bufferSource.connect(offlineCtx.destination);
    bufferSource.start();
    return offlineCtx.startRendering();
  }

  static trimSilence(
    audioBuffer: AudioBuffer,
    threshold = 0.01,
    padding = 0.1
  ): AudioBuffer {
    const sampleRate = audioBuffer.sampleRate;
    const channels = audioBuffer.numberOfChannels;
    const channelData = audioBuffer.getChannelData(0); // Use first channel for detection

    let start = 0;
    let end = channelData.length - 1;

    // Find start of non-silent audio
    while (start < channelData.length && Math.abs(channelData[start]) < threshold) {
      start++;
    }
    start = Math.max(0, start - padding * sampleRate);

    // Find end of non-silent audio
    while (end > 0 && Math.abs(channelData[end]) < threshold) {
      end--;
    }
    end = Math.min(channelData.length - 1, end + padding * sampleRate);

    // Create new buffer with trimmed audio
    const trimmedLength = end - start + 1;
    const trimmedBuffer = new AudioContext().createBuffer(
      channels,
      trimmedLength,
      sampleRate
    );

    for (let c = 0; c < channels; c++) {
      const trimmedData = trimmedBuffer.getChannelData(c);
      const channelData = audioBuffer.getChannelData(c);
      for (let i = 0; i < trimmedLength; i++) {
        trimmedData[i] = channelData[start + i];
      }
    }

    return trimmedBuffer;
  }
}