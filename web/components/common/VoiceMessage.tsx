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
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    if (!waveformRef.current) return;

    // Create new wavesurfer instance
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: isDisabled ? '#e5e7eb' : '#d1d5db',
      progressColor: '#0496FF',
      cursorWidth: 0,
      barWidth: 2,
      barGap: 2,
      barRadius: 3,
      height: 30,
      normalize: true,
      fillParent: true,
    });

    // Store the instance
    wavesurferRef.current = wavesurfer;

    // Load the audio
    wavesurfer.load(audioSrc);

    // Set up event listeners
    wavesurfer.on('ready', () => {
      if (isMountedRef.current) {
        setDuration(wavesurfer.getDuration());
      }
    });

    wavesurfer.on('audioprocess', () => {
      if (isMountedRef.current) {
        setCurrentTime(wavesurfer.getCurrentTime());
      }
    });

    wavesurfer.on('finish', () => {
      if (isMountedRef.current) {
        setIsPlaying(false);
        setCurrentTime(0);
        wavesurfer.seekTo(0);
        if (onPause) onPause();
      }
    });

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      if (wavesurferRef.current) {
        try {
          // Stop any ongoing playback
          wavesurferRef.current.stop();
          // Wait a bit before destroying to ensure all operations are complete
          setTimeout(() => {
            if (wavesurferRef.current) {
              wavesurferRef.current.destroy();
              wavesurferRef.current = null;
            }
          }, 100);
        } catch (error) {
          console.error('Error cleaning up wavesurfer:', error);
        }
      }
    };
  }, [audioSrc, isDisabled, onPause]);

  const togglePlayPause = async () => {
    if (isDisabled || !wavesurferRef.current) return;
    
    try {
      if (isPlaying) {
        await wavesurferRef.current.pause();
        if (onPause) onPause();
        setIsPlaying(false);
      } else {
        // If we're at the end or not playing, reset to start
        if (currentTime >= duration || !isPlaying) {
          wavesurferRef.current.seekTo(0);
          setCurrentTime(0);
        }
        await wavesurferRef.current.play();
        if (onPlay) onPlay();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
      setIsPlaying(false);
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
        disabled={isDisabled || !wavesurferRef.current}
        className={`w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-accent/80 transition-colors shrink-0 ${isDisabled || !wavesurferRef.current ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent cursor-pointer'}`}
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