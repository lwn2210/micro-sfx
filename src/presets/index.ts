import { SoundSpec } from '../types';

export const PRESETS: Record<string, SoundSpec> = {
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
  select: {
    name: 'select',
    waveform: 'sine',
    frequency: 660,
    attack: 0.005,
    decay: 0.06,
    release: 0.01,
    volume: 0.2
  }
};
