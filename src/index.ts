import { PRESETS } from './presets/index.js';
import { playWebAudio, generatePCM, getAudioContext } from './core/synth.js';
import { encodeWAV, createWAVBlob } from './core/wav.js';
import { toDataURI, uint8ArrayToBase64 } from './core/base64.js';
import { SoundSpec, PlayOptions } from './types.js';

export * from './types.js';
export * from './presets/index.js';
export { playWebAudio, generatePCM, getAudioContext, encodeWAV, createWAVBlob, toDataURI, uint8ArrayToBase64 };

export interface SFXInstance {
  play(nameOrSpec: string | SoundSpec, options?: PlayOptions): void;
  coin(options?: PlayOptions): void;
  laser(options?: PlayOptions): void;
  jump(options?: PlayOptions): void;
  explosion(options?: PlayOptions): void;
  click(options?: PlayOptions): void;
  hit(options?: PlayOptions): void;
  powerup(options?: PlayOptions): void;
  select(options?: PlayOptions): void;
  generatePCM(nameOrSpec: string | SoundSpec, options?: PlayOptions, sampleRate?: number): Int16Array;
  encodeWAV(nameOrSpec: string | SoundSpec, options?: PlayOptions, sampleRate?: number): Uint8Array;
  createWAVBlob(nameOrSpec: string | SoundSpec, options?: PlayOptions, sampleRate?: number): Blob;
  toDataURI(nameOrSpec: string | SoundSpec, options?: PlayOptions, sampleRate?: number): string;
}

function resolveSpec(nameOrSpec: string | SoundSpec): SoundSpec {
  if (typeof nameOrSpec === 'string') {
    const found = PRESETS[nameOrSpec.toLowerCase()];
    if (!found) {
      throw new Error(`[micro-sfx] Preset '${nameOrSpec}' not found. Available: ${Object.keys(PRESETS).join(', ')}`);
    }
    return found;
  }
  return nameOrSpec;
}

export const sfx: SFXInstance = {
  play(nameOrSpec: string | SoundSpec, options?: PlayOptions): void {
    const spec = resolveSpec(nameOrSpec);
    playWebAudio(spec, options);
  },

  coin(options?: PlayOptions): void {
    playWebAudio(PRESETS.coin, options);
  },

  laser(options?: PlayOptions): void {
    playWebAudio(PRESETS.laser, options);
  },

  jump(options?: PlayOptions): void {
    playWebAudio(PRESETS.jump, options);
  },

  explosion(options?: PlayOptions): void {
    playWebAudio(PRESETS.explosion, options);
  },

  click(options?: PlayOptions): void {
    playWebAudio(PRESETS.click, options);
  },

  hit(options?: PlayOptions): void {
    playWebAudio(PRESETS.hit, options);
  },

  powerup(options?: PlayOptions): void {
    playWebAudio(PRESETS.powerup, options);
  },

  select(options?: PlayOptions): void {
    playWebAudio(PRESETS.select, options);
  },

  generatePCM(nameOrSpec: string | SoundSpec, options?: PlayOptions, sampleRate = 44100): Int16Array {
    const spec = resolveSpec(nameOrSpec);
    return generatePCM(spec, options, sampleRate);
  },

  encodeWAV(nameOrSpec: string | SoundSpec, options?: PlayOptions, sampleRate = 44100): Uint8Array {
    const spec = resolveSpec(nameOrSpec);
    const pcm = generatePCM(spec, options, sampleRate);
    return encodeWAV(pcm, sampleRate);
  },

  createWAVBlob(nameOrSpec: string | SoundSpec, options?: PlayOptions, sampleRate = 44100): Blob {
    const spec = resolveSpec(nameOrSpec);
    return createWAVBlob(spec, options, sampleRate);
  },

  toDataURI(nameOrSpec: string | SoundSpec, options?: PlayOptions, sampleRate = 44100): string {
    const spec = resolveSpec(nameOrSpec);
    return toDataURI(spec, options, sampleRate);
  }
};

export default sfx;
