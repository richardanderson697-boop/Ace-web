/**
 * Web Audio API ambient audiobook narration preview synthesizer.
 * Generates an atmospheric cinematic narration bed and audio frequency data
 * for real-time waveform visualization without needing external audio host dependencies.
 */

class AudioPreviewEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private currentVolume = 0.8;
  private currentPlaybackRate = 1.0;
  private intervalId: number | null = null;
  private synthNodes: { stop: () => void }[] = [];

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.masterGain) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.currentVolume;
    }
    if (!this.analyser) {
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
  }

  public playTrack(trackId: string, onUpdateFrequency?: (data: Uint8Array) => void) {
    this.initContext();
    this.stop();

    if (!this.ctx || !this.masterGain) return;
    this.isPlaying = true;

    // Harmonic profile tailored for audiobooks (warm fundamental, atmospheric pad, formant pulse)
    const baseFreq = trackId.includes('cyberpunk') ? 110 : trackId.includes('space') ? 92.5 : trackId.includes('noir') ? 82.4 : 98;
    const now = this.ctx.currentTime;

    // Pad oscillator 1
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    const filter1 = this.ctx.createBiquadFilter();
    
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(baseFreq, now);
    filter1.type = 'lowpass';
    filter1.frequency.setValueAtTime(450, now);
    filter1.Q.setValueAtTime(3, now);

    gain1.gain.setValueAtTime(0.001, now);
    gain1.gain.exponentialRampToValueAtTime(0.2, now + 0.5);

    osc1.connect(filter1);
    filter1.connect(gain1);
    gain1.connect(this.masterGain);

    // Warm sub oscillator
    const oscSub = this.ctx.createOscillator();
    const gainSub = this.ctx.createGain();
    oscSub.type = 'sine';
    oscSub.frequency.setValueAtTime(baseFreq / 2, now);
    gainSub.gain.setValueAtTime(0.001, now);
    gainSub.gain.exponentialRampToValueAtTime(0.25, now + 0.3);

    oscSub.connect(gainSub);
    gainSub.connect(this.masterGain);

    // Rhythmic narration speech formant emulation pulse
    const oscFormant = this.ctx.createOscillator();
    const gainFormant = this.ctx.createGain();
    const filterFormant = this.ctx.createBiquadFilter();

    oscFormant.type = 'triangle';
    oscFormant.frequency.setValueAtTime(baseFreq * 2, now);
    filterFormant.type = 'bandpass';
    filterFormant.frequency.setValueAtTime(900, now);
    filterFormant.Q.setValueAtTime(5, now);

    gainFormant.gain.setValueAtTime(0.05, now);

    oscFormant.connect(filterFormant);
    filterFormant.connect(gainFormant);
    gainFormant.connect(this.masterGain);

    osc1.start(now);
    oscSub.start(now);
    oscFormant.start(now);

    this.synthNodes.push({
      stop: () => {
        try {
          osc1.stop();
          oscSub.stop();
          oscFormant.stop();
        } catch {
          // ignore already stopped
        }
      }
    });

    // Animate frequency data for visualizer
    if (onUpdateFrequency && this.analyser) {
      const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      const update = () => {
        if (!this.isPlaying || !this.analyser) return;
        this.analyser.getByteFrequencyData(dataArray);
        onUpdateFrequency(dataArray);
        this.intervalId = window.requestAnimationFrame(update);
      };
      this.intervalId = window.requestAnimationFrame(update);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.intervalId) {
      window.cancelAnimationFrame(this.intervalId);
      this.intervalId = null;
    }
    this.synthNodes.forEach(node => node.stop());
    this.synthNodes = [];
  }

  public pause() {
    this.stop();
  }

  public setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.currentVolume, this.ctx.currentTime);
    }
  }

  public setRate(rate: number) {
    this.currentPlaybackRate = rate;
  }

  public getPlaybackRate(): number {
    return this.currentPlaybackRate;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const audioSynth = new AudioPreviewEngine();
