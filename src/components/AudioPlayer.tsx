import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  X, 
  ShoppingBag,
  Sparkles,
  Check
} from 'lucide-react';
import { Book } from '../types';
import { audioSynth } from '../utils/audioSynth';

interface AudioPlayerProps {
  currentBook: Book | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onClose: () => void;
  onBuyBook: (book: Book) => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentBook,
  isPlaying,
  onTogglePlay,
  onClose,
  onBuyBook
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [frequencyData, setFrequencyData] = useState<number[]>(new Array(16).fill(10));
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const duration = currentBook?.audioSample.durationSeconds || 180;

  // Track playback time
  useEffect(() => {
    let timer: number;
    if (isPlaying) {
      timer = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            audioSynth.stop();
            onTogglePlay();
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, duration, playbackSpeed, onTogglePlay]);

  // Handle synth playback state & audio analyser waveform
  useEffect(() => {
    if (isPlaying && currentBook) {
      audioSynth.playTrack(currentBook.audioSample.url, (data) => {
        // Sample down to 16 bars for the visualizer
        const sampled: number[] = [];
        const step = Math.floor(data.length / 16);
        for (let i = 0; i < 16; i++) {
          sampled.push(data[i * step] || 10);
        }
        setFrequencyData(sampled);
      });
    } else {
      audioSynth.pause();
    }
  }, [isPlaying, currentBook]);

  // Volume change
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    setIsMuted(newVol === 0);
    audioSynth.setVolume(newVol);
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      audioSynth.setVolume(volume || 0.85);
    } else {
      setIsMuted(true);
      audioSynth.setVolume(0);
    }
  };

  const cycleSpeed = () => {
    const speeds = [1.0, 1.25, 1.5, 2.0];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    const newSpeed = speeds[nextIdx];
    setPlaybackSpeed(newSpeed);
    audioSynth.setRate(newSpeed);
  };

  const skipTime = (seconds: number) => {
    setCurrentTime(prev => Math.max(0, Math.min(duration, prev + seconds)));
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = Math.floor(secs % 60);
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  if (!currentBook) return null;

  return (
    <aside aria-label="Audio sample player" className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 border-t border-amber-500/30 backdrop-blur-xl shadow-2xl text-slate-100 transition-all duration-300">
      
      {/* Top progress scrubber bar */}
      <div className="relative w-full h-1.5 bg-slate-800 cursor-pointer group">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-300 transition-all group-hover:h-2"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        />
        <input 
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={(e) => setCurrentTime(Number(e.target.value))}
          aria-label="Audio sample scrub position"
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left: Book artwork & track info */}
        <div className="flex items-center space-x-3 w-full md:w-1/3 min-w-0">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-slate-700 shadow-md">
            <img 
              src={currentBook.coverImage} 
              alt={currentBook.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-medium px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                SAMPLE PREVIEW
              </span>
              <span className="text-[11px] text-slate-400 truncate">
                {currentBook.audioSample.narrator && `Narrated by ${currentBook.audioSample.narrator}`}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-white truncate hover:text-amber-400 transition-colors">
              {currentBook.title}
            </h4>
            <p className="text-xs text-slate-400 truncate">
              {currentBook.audioSample.sampleTitle}
            </p>
          </div>
        </div>

        {/* Center: Controls, Scrubber & Real-time Waveform */}
        <div className="flex flex-col items-center w-full md:w-1/3">
          <div className="flex items-center space-x-4">
            
            {/* Skip back 15s */}
            <button
              onClick={() => skipTime(-15)}
              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded-full transition-colors"
              title="Skip backward 15 seconds"
              aria-label="Skip backward 15 seconds"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Play/Pause Main */}
            <button
              id="audio-player-toggle"
              onClick={onTogglePlay}
              className="w-11 h-11 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 flex items-center justify-center shadow-lg shadow-orange-950/40 hover:scale-105 active:scale-95 transition-transform"
              aria-label={isPlaying ? 'Pause Audio Preview' : 'Play Audio Preview'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-slate-950 fill-current" />
              ) : (
                <Play className="w-5 h-5 text-slate-950 fill-current ml-0.5" />
              )}
            </button>

            {/* Skip forward 30s */}
            <button
              onClick={() => skipTime(30)}
              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-900 rounded-full transition-colors"
              title="Skip forward 30 seconds"
              aria-label="Skip forward 30 seconds"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Playback speed multiplier */}
            <button
              onClick={cycleSpeed}
              className="px-2 py-0.5 rounded text-xs font-mono font-medium text-slate-300 hover:text-amber-400 bg-slate-900 border border-slate-800 transition-colors"
              title="Playback speed"
            >
              {playbackSpeed}x
            </button>
          </div>

          {/* Time and Mini Waveform */}
          <div className="flex items-center space-x-3 mt-1 text-xs text-slate-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            
            {/* Waveform graphic */}
            <div className="flex items-end space-x-0.5 h-4 px-1" title="Real-time acoustic preview waveform">
              {frequencyData.map((val, idx) => {
                const height = isPlaying ? Math.max(3, Math.min(16, (val / 255) * 16)) : 3;
                return (
                  <span
                    key={idx}
                    className={`w-1 rounded-t transition-all duration-75 ${
                      isPlaying ? 'bg-amber-400' : 'bg-slate-700'
                    }`}
                    style={{ height: `${height}px` }}
                  />
                );
              })}
            </div>

            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Volume, Direct Purchase Conversion & Dismiss */}
        <div className="flex items-center justify-end space-x-3 w-full md:w-1/3">
          
          {/* Volume control */}
          <div className="hidden sm:flex items-center space-x-2 text-slate-400">
            <button 
              onClick={toggleMute}
              className="p-1 hover:text-white transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
              aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(Number(e.target.value))}
              aria-label="Volume slider"
              className="w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Direct Buy Conversion Button */}
          <button
            id="audio-player-buy-button"
            onClick={() => onBuyBook(currentBook)}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-medium text-xs sm:text-sm shadow-md transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Buy Audio • ${currentBook.priceAudio.toFixed(2)}</span>
          </button>

          {/* Close Player */}
          <button
            onClick={() => {
              audioSynth.stop();
              onClose();
            }}
            className="p-1 text-slate-500 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors"
            title="Close player"
            aria-label="Close audio player"
          >
            <X className="w-4 h-4" />
          </button>

        </div>

      </div>
    </aside>
  );
};
