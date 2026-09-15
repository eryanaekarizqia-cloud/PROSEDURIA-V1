/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Web Audio API Sound Synthesizer for Cyber-Nusantara Soundscapes
class SoundFXEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playChime(type: 'glitch' | 'gold' | 'cyan' | 'repair' | 'victory' | 'click' | 'error' | 'success' | string) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      switch (type) {
        case 'glitch': {
          // Distorted square wave with rapid pitch flutter
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(160, now);
          osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);
          osc.frequency.setValueAtTime(320, now + 0.1);
          osc.frequency.exponentialRampToValueAtTime(120, now + 0.22);

          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.24);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.25);
          break;
        }

        case 'gold': {
          // Pentatonic warm chime chord (like Javanese Gamelan Slendro tone)
          const freqs = [523.25, 659.25, 783.99, 1046.5];
          freqs.forEach((freq, idx) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.05);

            gain.gain.setValueAtTime(0.06, now + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.6);

            osc.connect(gain);
            gain.connect(this.ctx!.destination);
            osc.start(now + idx * 0.05);
            osc.stop(now + idx * 0.05 + 0.65);
          });
          break;
        }

        case 'cyan': {
          // High-tech shimmering sine sweep
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);

          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.24);
          break;
        }

        case 'repair': {
          // Dual ascending harmonious tones (wrench/repair completion)
          [392, 587.33, 880].forEach((freq, i) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + i * 0.08);

            gain.gain.setValueAtTime(0.07, now + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.4);

            osc.connect(gain);
            gain.connect(this.ctx!.destination);
            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.45);
          });
          break;
        }

        case 'victory': {
          // Grand fanfare chord progression
          const notes = [440, 554.37, 659.25, 880, 1108.73];
          notes.forEach((freq, idx) => {
            const osc = this.ctx!.createOscillator();
            const gain = this.ctx!.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.07);

            gain.gain.setValueAtTime(0.08, now + idx * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.8);

            osc.connect(gain);
            gain.connect(this.ctx!.destination);
            osc.start(now + idx * 0.07);
            osc.stop(now + idx * 0.07 + 0.85);
          });
          break;
        }

        case 'click': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(750, now);
          osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.05);
          break;
        }

        case 'error': {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.setValueAtTime(130, now + 0.08);

          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.26);
          break;
        }

        default: {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(520, now);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.11);
          break;
        }
      }
    } catch {
      // Audio autoplay policy or inactive context silently handled
    }
  }
}

export const soundFX = new SoundFXEngine();
