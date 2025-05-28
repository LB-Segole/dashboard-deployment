import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Slider } from '@/components/ui/Slider';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (values: number[]) => {
    if (audioRef.current) {
      const newTime = values[0];
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (values: number[]) => {
    if (audioRef.current) {
      const newVolume = values[0];
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">{formatTime(currentTime)}</span>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSeek([Math.max(0, currentTime - 10)])}
          >
            <SkipBack className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="rounded-full"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleSeek([Math.min(duration, currentTime + 10)])}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
        <span className="text-sm text-gray-500">{formatTime(duration)}</span>
      </div>

      <Slider
        value={currentTime}
        min={0}
        max={duration}
        step={0.1}
        onChange={e => handleSeek([Number(e.target.value)])}
        className="mb-4"
      />

      <div className="flex items-center space-x-2">
        <Volume2 className="h-4 w-4 text-gray-500" />
        <Slider
          value={volume}
          min={0}
          max={1}
          step={0.1}
          onChange={e => handleVolumeChange([Number(e.target.value)])}
          className="w-24"
        />
      </div>
    </div>
  );
};