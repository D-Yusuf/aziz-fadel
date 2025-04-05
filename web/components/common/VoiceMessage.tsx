import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';
import WaveSurfer from 'wavesurfer.js';

interface VoiceMessageProps {
  audioSrc: string;
  isDisabled?: boolean;
  onPlay?: () => void;
  onPause?: () => void;
}

export default function VoiceMessage({ audioSrc, isDisabled = false, onPlay, onPause }: VoiceMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    if (waveformRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: isDisabled ? '#e5e7eb' : '#d1d5db', // Lighter gray when disabled
        progressColor: '#0496FF',
        cursorWidth: 0,
        barWidth: 2,
        barGap: 2,
        barRadius: 3,
        height: 30,
        normalize: true,
        fillParent: true,
      });

      wavesurferRef.current.load(audioSrc);

      wavesurferRef.current.on('ready', () => {
        setDuration(wavesurferRef.current?.getDuration() || 0);
      });

      wavesurferRef.current.on('audioprocess', () => {
        setCurrentTime(wavesurferRef.current?.getCurrentTime() || 0);
      });

      wavesurferRef.current.on('finish', () => {
        setIsPlaying(false);
        setCurrentTime(0);
        wavesurferRef.current?.seekTo(0);
        if (onPause) onPause();
      });

      return () => {
        wavesurferRef.current?.destroy();
      };
    }
  }, [audioSrc, isDisabled, onPause]);

  const togglePlayPause = () => {
    if (isDisabled) return;
    
    if (wavesurferRef.current) {
      if (isPlaying) {
        wavesurferRef.current.pause();
        if (onPause) onPause();
      } else {
        wavesurferRef.current.play();
        if (onPlay) onPlay();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center gap-4 bg-secondary rounded-2xl p-4 w-full shadow-sm transition-opacity duration-300 ${isDisabled ? 'opacity-50' : 'opacity-100'}`}>
      <button
        onClick={togglePlayPause}
        disabled={isDisabled}
        className={`w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-accent/80 transition-colors shrink-0 ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent cursor-pointer'}`}
      >
        {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} className="ml-1" />}
      </button>
      
      <div className="flex-1 flex flex-col min-w-0">
        <div className="relative h-8" ref={waveformRef} />
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
          <span className="text-xs text-gray-500">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
} 