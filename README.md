# 🎛️ micro-sfx

> **Zero-asset, zero-dependency procedural sound synthesis engine.**  
> Real-time mathematical audio for **Web, React Native, Unity, and Godot**.

[![npm version](https://img.shields.io/npm/v/micro-sfx?color=blue&style=flat-square)](https://www.npmjs.com/package/micro-sfx)
[![license](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![bundle size](https://img.shields.io/badge/gzipped-<2KB-brightgreen?style=flat-square)](#)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-Donate-yellow?style=flat-square&logo=buy-me-a-coffee)](#-support--community)

---

## 💡 Why `micro-sfx`?

Stop bundling megabytes of `.wav` and `.mp3` files for UI clicks and arcade game sounds.

- **0 KB Asset Downloads:** Audio synthesized mathematically on-the-fly via native DSP.
- **Zero Dependencies:** Pure TypeScript / WebAudio / Native PCM.
- **Cross-Platform:** One unified sound parameter contract across Web, Mobile, and Game Engines.
- **Instant Playback:** `< 5ms` latency, immune to HTTP network lag.

---

## 🚀 Quick Start (Web / TypeScript)

### 1. Installation
```bash
npm install micro-sfx
```

### 2. Usage
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
```

---

## 🎮 Unity C# Runtime

Use `runtimes/unity/MicroSFX.cs` directly in your Unity project. Zero audio assets needed in your `Resources/` folder!

```csharp
using MicroSFX;

// Play anywhere in your code
MicroSFX.Play("coin");
MicroSFX.Play("laser", pitch: 1.2f, volume: 0.8f);
```

*Reduces your WebGL / Android APK build size significantly.*

---

## 📱 Mobile (React Native / Expo)

Generate raw PCM in-memory and feed directly into audio buffers:

```typescript
import { sfx } from 'micro-sfx';

// Returns Int16Array PCM sample buffer (44.1kHz mono)
const pcmBuffer = sfx.generatePCM('coin');
```

---

## 🎛️ Available Presets

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

## ☕ Support & Community

If you find `micro-sfx` useful in your web apps, mobile products, or games:

- ⭐ **Star this repository** to help others discover it!
- ☕ **Support the project:** [Buy Me A Coffee](https://www.buymeacoffee.com)

---

## 📄 License

MIT © [lwn2210](https://github.com/lwn2210)
