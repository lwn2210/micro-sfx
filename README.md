# 🎛️ micro-sfx

> **Zero-asset, zero-dependency procedural sound synthesis engine.**  
> Real-time mathematical audio for **Web, React Native, Unity, Godot, Flutter, iOS (Swift), and Android (Kotlin)**.

[![CI](https://github.com/lwn2210/micro-sfx/actions/workflows/ci.yml/badge.svg)](https://github.com/lwn2210/micro-sfx/actions)
[![license](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![bundle size](https://img.shields.io/badge/gzipped-<2KB-brightgreen?style=flat-square)](#)

---

## 💡 Why `micro-sfx`?

Stop bundling megabytes of `.wav` and `.mp3` files for UI clicks and arcade game sounds.

- **0 KB Asset Downloads:** Audio synthesized mathematically on-the-fly via native DSP.
- **Zero Dependencies:** Pure TypeScript / WebAudio / Native PCM.
- **True Multi-Platform:** One unified sound parameter contract across Web, Mobile (iOS/Android/Flutter/React Native), and Game Engines (Unity/Godot).
- **Offline WAV Generator:** Export raw WAV files in Node.js or browser without third-party encoders.
- **Instant Playback:** `< 5ms` latency, immune to HTTP network lag.

---

## 🚀 Interactive Studio Playground

Experience the real-time procedural sound engine directly in your browser:
Open `examples/web/index.html` to preview all presets, adjust pitch/volume in real-time, and copy one-line integration code.

---

## 💻 Cross-Platform Implementation Guides

### 1. 🌐 Web & TypeScript / JavaScript

#### Installation
```bash
npm install micro-sfx
```

#### Usage
```typescript
import { sfx } from 'micro-sfx';

// Built-in presets
button.addEventListener('click', () => sfx.click());
onCollectCoin(() => sfx.coin());
onPlayerJump(() => sfx.jump());
onBombExplode(() => sfx.explosion());
onLaserFire(() => sfx.laser());

// Dynamic pitch & volume modifiers
sfx.jump({ pitch: 1.5, volume: 0.8 });

// Export to RIFF WAV container (Node.js or Browser)
const wavBytes = sfx.encodeWAV('coin');
```

---

### 2. 🎮 Game Engines

#### A. Unity (C#)
Drop `runtimes/unity/MicroSFX.cs` into your Unity project assets:
```csharp
using MicroSFX;

// Zero audio clips needed in your Resources folder!
MicroSFX.Play("coin");
MicroSFX.Play("laser", pitch: 1.2f, volume: 0.8f);
```

#### B. Godot 4 (GDScript)
Drop `runtimes/godot/MicroSFX.gd` into your project:
```gdscript
# Synthesize real-time audio via AudioStreamGenerator
MicroSFX.play("coin", get_tree())
MicroSFX.play("laser", get_tree(), 1.2, 0.8)
```

---

### 3. 📱 Mobile Applications

#### A. Flutter / Dart
Use `runtimes/flutter/micro_sfx.dart`:
```dart
import 'package:micro_sfx/micro_sfx.dart';

// Generates raw Float32List sample stream
final samples = MicroSFX.generateFloat32('coin', pitch: 1.0, volume: 0.8);
```

#### B. Native iOS (Swift)
Use `runtimes/ios/MicroSFX.swift` with native `AVAudioEngine`:
```swift
MicroSFX.shared.play("coin")
MicroSFX.shared.play("laser", pitch: 1.2, volume: 0.9)
```

#### C. Native Android (Kotlin)
Use `runtimes/android/MicroSFX.kt` with native `AudioTrack`:
```kotlin
MicroSFX.play("coin")
MicroSFX.play("explosion", pitch: 0.9f, volume: 1.0f)
```

#### D. React Native / Expo
```typescript
import { sfx } from 'micro-sfx';

// Returns Int16Array PCM sample buffer (44.1kHz mono)
const pcmBuffer = sfx.generatePCM('coin');
```

---

## 🎛️ Built-in Presets

| Preset | Waveform | Ideal For |
| :--- | :--- | :--- |
| `coin` | Square | Coins, gems, score increases, pickups |
| `laser` | Sawtooth | Projectiles, blasters, retro shooter guns |
| `jump` | Square | Character jumping, bouncy platforms |
| `explosion` | Noise | Bombs, impacts, crumbling walls |
| `click` | Sine | UI buttons, toggles, keyboard clicks |
| `hit` | Sawtooth | Damage taken, shield hits |
| `powerup` | Triangle | Level complete, upgrades, buffs |
| `select` | Sine | Menu navigation, hovering |

---

## 📄 License

MIT © [lwn2210](https://github.com/lwn2210)
