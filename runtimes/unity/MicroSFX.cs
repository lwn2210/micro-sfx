using System;
using System.Collections.Generic;
using UnityEngine;

namespace MicroSFX
{
    public enum Waveform { Sine, Square, Sawtooth, Triangle, Noise }

    [System.Serializable]
    public struct SoundSpec
    {
        public string name;
        public Waveform waveform;
        public float frequency;
        public float frequencyEnd;
        public float jumpTime;
        public float jumpFrequency;
        public float attack;
        public float decay;
        public float release;
        public float volume;
    }

    [RequireComponent(typeof(AudioSource))]
    public class MicroSFX : MonoBehaviour
    {
        public static MicroSFX Instance { get; private set; }
        private AudioSource audioSource;
        private const int SampleRate = 44100;

        private static readonly Dictionary<string, SoundSpec> Presets = new Dictionary<string, SoundSpec>
        {
            { "coin", new SoundSpec { waveform = Waveform.Square, frequency = 987.77f, jumpTime = 0.08f, jumpFrequency = 1318.51f, attack = 0.005f, decay = 0.25f, release = 0.05f, volume = 0.3f } },
            { "laser", new SoundSpec { waveform = Waveform.Sawtooth, frequency = 880f, frequencyEnd = 110f, attack = 0.005f, decay = 0.15f, release = 0.02f, volume = 0.3f } },
            { "jump", new SoundSpec { waveform = Waveform.Square, frequency = 150f, frequencyEnd = 600f, attack = 0.005f, decay = 0.18f, release = 0.02f, volume = 0.25f } },
            { "explosion", new SoundSpec { waveform = Waveform.Noise, frequency = 800f, attack = 0.01f, decay = 0.45f, release = 0.1f, volume = 0.4f } },
            { "click", new SoundSpec { waveform = Waveform.Sine, frequency = 500f, frequencyEnd = 200f, attack = 0.001f, decay = 0.03f, release = 0.01f, volume = 0.25f } },
            { "powerup", new SoundSpec { waveform = Waveform.Triangle, frequency = 330f, frequencyEnd = 880f, attack = 0.02f, decay = 0.3f, release = 0.05f, volume = 0.3f } }
        };

        private void Awake()
        {
            if (Instance == null)
            {
                Instance = this;
                DontDestroyOnLoad(gameObject);
                audioSource = GetComponent<AudioSource>();
            }
            else
            {
                Destroy(gameObject);
            }
        }

        public static void Play(string presetName, float pitch = 1.0f, float volume = 1.0f)
        {
            if (Instance == null)
            {
                GameObject go = new GameObject("MicroSFX_Runtime");
                Instance = go.AddComponent<MicroSFX>();
            }

            if (Presets.TryGetValue(presetName.ToLower(), out SoundSpec spec))
            {
                AudioClip clip = GenerateClip(spec, pitch, volume);
                Instance.audioSource.PlayOneShot(clip);
            }
            else
            {
                Debug.LogWarning($"[MicroSFX] Preset '{presetName}' not found.");
            }
        }

        public static AudioClip GenerateClip(SoundSpec spec, float pitch = 1.0f, float volume = 1.0f)
        {
            float duration = spec.attack + spec.decay + spec.release;
            int totalSamples = Mathf.FloorToInt(SampleRate * duration);
            float[] samples = new float[totalSamples];

            float baseFreq = spec.frequency * pitch;
            float currentFreq = baseFreq;
            float phase = 0f;
            float masterVol = spec.volume * volume;

            System.Random rand = new System.Random();

            for (int i = 0; i < totalSamples; i++)
            {
                float t = (float)i / SampleRate;

                // Frequency modulation
                if (spec.jumpTime > 0 && t >= spec.jumpTime)
                {
                    currentFreq = spec.jumpFrequency * pitch;
                }
                else if (spec.frequencyEnd > 0)
                {
                    float progress = t / duration;
                    currentFreq = Mathf.Lerp(baseFreq, spec.frequencyEnd * pitch, progress);
                }

                // ADSR Volume Envelope
                float env = 0f;
                if (t < spec.attack)
                {
                    env = t / spec.attack;
                }
                else
                {
                    env = Mathf.Max(0f, 1.0f - (t - spec.attack) / (spec.decay + spec.release));
                }

                // Waveform generation
                phase += (2.0f * Mathf.PI * currentFreq) / SampleRate;
                float sample = 0f;

                switch (spec.waveform)
                {
                    case Waveform.Sine:
                        sample = Mathf.Sin(phase);
                        break;
                    case Waveform.Square:
                        sample = Mathf.Sin(phase) >= 0 ? 1f : -1f;
                        break;
                    case Waveform.Sawtooth:
                        sample = 2f * (phase / (2f * Mathf.PI) - Mathf.Floor(phase / (2f * Mathf.PI) + 0.5f));
                        break;
                    case Waveform.Triangle:
                        sample = 2f * Mathf.Abs(2f * (phase / (2f * Mathf.PI) - Mathf.Floor(phase / (2f * Mathf.PI) + 0.5f))) - 1f;
                        break;
                    case Waveform.Noise:
                        sample = (float)(rand.NextDouble() * 2.0 - 1.0);
                        break;
                }

                samples[i] = sample * env * masterVol;
            }

            AudioClip clip = AudioClip.Create(spec.name ?? "MicroSFX_Clip", totalSamples, 1, SampleRate, false);
            clip.SetData(samples, 0);
            return clip;
        }
    }
}
