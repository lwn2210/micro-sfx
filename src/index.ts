import { PRESETS } from './presets';
import { playWebAudio, generatePCM, getAudioContext } from './core/synth';
import { SoundSpec, PlayOptions } from './types';

export * from './types';
export * from './presets';
export { playWebAudio, generatePCM, getAudioContext };

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
  }
};

export default sfx;
