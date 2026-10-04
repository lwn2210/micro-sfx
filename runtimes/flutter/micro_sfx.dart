// MicroSFX - Zero-asset procedural audio engine for Flutter / Dart
// Synthesizes mathematical audio on-the-fly into raw samples and RIFF WAV byte buffers.
// Compatible with any Flutter audio plugin: audioplayers, just_audio, or flutter_sound.

import 'dart:math';
import 'dart:typed_data';

enum Waveform { sine, square, sawtooth, triangle, noise }

class SoundSpec {
  final String name;
  final Waveform waveform;
  final double frequency;
  final double frequencyEnd;
  final double jumpTime;
  final double jumpFrequency;
  final double attack;
  final double decay;
  final double release;
  final double volume;

  const SoundSpec({
    required this.name,
    required this.waveform,
    required this.frequency,
    this.frequencyEnd = 0.0,
    this.jumpTime = 0.0,
    this.jumpFrequency = 0.0,
    this.attack = 0.005,
    this.decay = 0.15,
    this.release = 0.05,
    this.volume = 0.3,
  });
}

class MicroSFX {
  static const int sampleRate = 44100;

  static const Map<String, SoundSpec> presets = {
    'coin': SoundSpec(
      name: 'coin',
      waveform: Waveform.square,
      frequency: 987.77,
      jumpTime: 0.08,
      jumpFrequency: 1318.51,
      decay: 0.25,
      volume: 0.25,
    ),
    'laser': SoundSpec(
      name: 'laser',
      waveform: Waveform.sawtooth,
      frequency: 880.0,
      frequencyEnd: 110.0,
      decay: 0.15,
      volume: 0.25,
    ),
    'jump': SoundSpec(
      name: 'jump',
      waveform: Waveform.square,
      frequency: 150.0,
      frequencyEnd: 600.0,
      decay: 0.18,
      volume: 0.2,
    ),
    'explosion': SoundSpec(
      name: 'explosion',
      waveform: Waveform.noise,
      frequency: 800.0,
      decay: 0.45,
      volume: 0.35,
    ),
    'click': SoundSpec(
      name: 'click',
      waveform: Waveform.sine,
      frequency: 500.0,
      frequencyEnd: 200.0,
      decay: 0.03,
      volume: 0.25,
    ),
    'hit': SoundSpec(
      name: 'hit',
      waveform: Waveform.sawtooth,
      frequency: 220.0,
      frequencyEnd: 60.0,
      decay: 0.12,
      volume: 0.3,
    ),
    'powerup': SoundSpec(
      name: 'powerup',
      waveform: Waveform.triangle,
      frequency: 330.0,
      frequencyEnd: 880.0,
      attack: 0.02,
      decay: 0.3,
      volume: 0.25,
    ),
    'select': SoundSpec(
      name: 'select',
      waveform: Waveform.sine,
      frequency: 660.0,
      decay: 0.06,
      volume: 0.2,
    ),
  };

  /// Generates a 16-bit Mono PCM Int16List
  static Int16List generatePCM(String presetName, {double pitch = 1.0, double volume = 1.0}) {
    final spec = presets[presetName.toLowerCase()];
    if (spec == null) {
      throw ArgumentError('Preset not found: $presetName');
    }

    final duration = spec.attack + spec.decay + spec.release;
    final totalSamples = (sampleRate * duration).floor();
    final buffer = Int16List(totalSamples);

    final baseFreq = spec.frequency * pitch;
    double currentFreq = baseFreq;
    double phase = 0.0;
    final masterVol = spec.volume * volume;
    final random = Random();

    for (int i = 0; i < totalSamples; i++) {
      final t = i / sampleRate;

      if (spec.jumpTime > 0 && t >= spec.jumpTime) {
        currentFreq = spec.jumpFrequency * pitch;
      } else if (spec.frequencyEnd > 0) {
        final progress = t / duration;
        currentFreq = baseFreq + (spec.frequencyEnd * pitch - baseFreq) * progress;
      }

      double env = 0.0;
      if (t < spec.attack) {
        env = t / spec.attack;
      } else {
        env = max(0.0, 1.0 - (t - spec.attack) / (spec.decay + spec.release));
      }

      phase += (2.0 * pi * currentFreq) / sampleRate;
      double sample = 0.0;

      switch (spec.waveform) {
        case Waveform.sine:
          sample = sin(phase);
          break;
        case Waveform.square:
          sample = sin(phase) >= 0 ? 1.0 : -1.0;
          break;
        case Waveform.sawtooth:
          sample = 2.0 * (phase / (2.0 * pi) - (phase / (2.0 * pi) + 0.5).floor());
          break;
        case Waveform.triangle:
          sample = 2.0 * (2.0 * (phase / (2.0 * pi) - (phase / (2.0 * pi) + 0.5).floor())).abs() - 1.0;
          break;
        case Waveform.noise:
          sample = random.nextDouble() * 2.0 - 1.0;
          break;
      }

      final intVal = (sample * env * masterVol * 32767.0).floor().clamp(-32768, 32767);
      buffer[i] = intVal;
    }

    return buffer;
  }

  /// Encodes the sound into a complete standard RIFF WAV byte buffer (Uint8List).
  /// Ready to be played directly via `audioplayers`:
  /// `await player.play(BytesSource(MicroSFX.generateWAV('coin')))`
  static Uint8List generateWAV(String presetName, {double pitch = 1.0, double volume = 1.0}) {
    final pcm = generatePCM(presetName, pitch: pitch, volume: volume);
    final dataSize = pcm.length * 2;
    final buffer = Uint8List(44 + dataSize);
    final bdata = ByteData.view(buffer.buffer);

    void writeString(int offset, String str) {
      for (int i = 0; i < str.length; i++) {
        buffer[offset + i] = str.codeUnitAt(i);
      }
    }

    // RIFF chunk
    writeString(0, 'RIFF');
    bdata.setUint32(4, 36 + dataSize, Endian.little);
    writeString(8, 'WAVE');

    // fmt chunk
    writeString(12, 'fmt ');
    bdata.setUint32(16, 16, Endian.little); // Subchunk1Size
    bdata.setUint16(20, 1, Endian.little);  // AudioFormat (PCM)
    bdata.setUint16(22, 1, Endian.little);  // Channels (Mono)
    bdata.setUint32(24, sampleRate, Endian.little); // SampleRate
    bdata.setUint32(28, sampleRate * 2, Endian.little); // ByteRate
    bdata.setUint16(32, 2, Endian.little);  // BlockAlign
    bdata.setUint16(34, 16, Endian.little); // BitsPerSample

    // data chunk
    writeString(36, 'data');
    bdata.setUint32(40, dataSize, Endian.little);

    // PCM samples
    int offset = 44;
    for (int i = 0; i < pcm.length; i++, offset += 2) {
      bdata.setInt16(offset, pcm[i], Endian.little);
    }

    return buffer;
  }
}
