import { SoundSpec } from '../types';

export const PRESETS: Record<string, SoundSpec> = {
  // --- Retro Arcade & Action ---
  coin: {
    name: 'coin',
    waveform: 'square',
    frequency: 987.77, // B5
    frequencyJump: { time: 0.08, to: 1318.51 }, // E6
    attack: 0.005,
    decay: 0.25,
    release: 0.05,
    volume: 0.25
  },
  laser: {
    name: 'laser',
    waveform: 'sawtooth',
    frequency: 880,
    frequencyEnd: 110,
    attack: 0.005,
    decay: 0.15,
    release: 0.02,
    volume: 0.25
  },
  jump: {
    name: 'jump',
    waveform: 'square',
    frequency: 150,
    frequencyEnd: 600,
    attack: 0.005,
    decay: 0.18,
    release: 0.02,
    volume: 0.2
  },
  explosion: {
    name: 'explosion',
    waveform: 'noise',
    frequency: 800,
    noiseFilterCutoff: 800,
    attack: 0.01,
    decay: 0.45,
    release: 0.1,
    volume: 0.35
  },
  hit: {
    name: 'hit',
    waveform: 'sawtooth',
    frequency: 220,
    frequencyEnd: 60,
    attack: 0.002,
    decay: 0.12,
    release: 0.02,
    volume: 0.3
  },
  powerup: {
    name: 'powerup',
    waveform: 'triangle',
    frequency: 330,
    frequencyEnd: 880,
    attack: 0.02,
    decay: 0.3,
    release: 0.05,
    volume: 0.25
  },

  // --- UI & Web/Mobile Interactions ---
  click: {
    name: 'click',
    waveform: 'sine',
    frequency: 500,
    frequencyEnd: 200,
    attack: 0.001,
    decay: 0.03,
    release: 0.01,
    volume: 0.25
  },
  select: {
    name: 'select',
    waveform: 'sine',
    frequency: 660,
    attack: 0.005,
    decay: 0.06,
    release: 0.01,
    volume: 0.2
  },
  blip: {
    name: 'blip',
    waveform: 'sine',
    frequency: 880,
    attack: 0.001,
    decay: 0.025,
    release: 0.005,
    volume: 0.2
  },
  tap: {
    name: 'tap',
    waveform: 'triangle',
    frequency: 380,
    frequencyEnd: 180,
    attack: 0.001,
    decay: 0.04,
    release: 0.01,
    volume: 0.22
  },
  toggle: {
    name: 'toggle',
    waveform: 'sine',
    frequency: 440,
    frequencyJump: { time: 0.03, to: 880 },
    attack: 0.002,
    decay: 0.08,
    release: 0.02,
    volume: 0.2
  },

  // --- System & Feedback Alerts ---
  success: {
    name: 'success',
    waveform: 'triangle',
    frequency: 523.25, // C5
    frequencyJump: { time: 0.09, to: 783.99 }, // G5
    attack: 0.005,
    decay: 0.32,
    release: 0.05,
    volume: 0.25
  },
  error: {
    name: 'error',
    waveform: 'sawtooth',
    frequency: 240,
    frequencyJump: { time: 0.08, to: 160 },
    attack: 0.005,
    decay: 0.25,
    release: 0.04,
    volume: 0.28
  },
  notification: {
    name: 'notification',
    waveform: 'sine',
    frequency: 587.33, // D5
    frequencyJump: { time: 0.07, to: 880.00 }, // A5
    attack: 0.003,
    decay: 0.22,
    release: 0.03,
    volume: 0.22
  },
  badge: {
    name: 'badge',
    waveform: 'triangle',
    frequency: 659.25, // E5
    frequencyJump: { time: 0.06, to: 1046.50 }, // C6
    attack: 0.005,
    decay: 0.2,
    release: 0.04,
    volume: 0.25
  },
  warp: {
    name: 'warp',
    waveform: 'sine',
    frequency: 120,
    frequencyEnd: 1200,
    attack: 0.01,
    decay: 0.35,
    release: 0.08,
    volume: 0.28
  }
};
