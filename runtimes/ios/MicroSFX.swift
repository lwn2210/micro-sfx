// MicroSFX - Swift (iOS / macOS) Native Procedural Audio Node
// Zero external sound files. Synthesized on-demand via AVAudioEngine & AVAudioSourceNode.

import Foundation
import AVFoundation

public enum MicroSFXWaveform {
    case sine, square, sawtooth, triangle, noise
}

public struct MicroSFXSpec {
    public let name: String
    public let waveform: MicroSFXWaveform
    public let frequency: Float
    public let frequencyEnd: Float
    public let jumpTime: Float
    public let jumpFrequency: Float
    public let attack: Float
    public let decay: Float
    public let release: Float
    public let volume: Float

    public init(name: String, waveform: MicroSFXWaveform, frequency: Float, frequencyEnd: Float = 0, jumpTime: Float = 0, jumpFrequency: Float = 0, attack: Float = 0.005, decay: Float = 0.15, release: Float = 0.05, volume: Float = 0.3) {
        self.name = name
        self.waveform = waveform
        self.frequency = frequency
        self.frequencyEnd = frequencyEnd
        self.jumpTime = jumpTime
        self.jumpFrequency = jumpFrequency
        self.attack = attack
        self.decay = decay
        self.release = release
        self.volume = volume
    }
}

public class MicroSFX {
    public static let shared = MicroSFX()
    
    private let engine = AVAudioEngine()
    private let sampleRate: Double = 44100.0

    public static let presets: [String: MicroSFXSpec] = [
        "coin": MicroSFXSpec(name: "coin", waveform: .square, frequency: 987.77, jumpTime: 0.08, jumpFrequency: 1318.51, decay: 0.25, volume: 0.25),
        "laser": MicroSFXSpec(name: "laser", waveform: .sawtooth, frequency: 880.0, frequencyEnd: 110.0, decay: 0.15, volume: 0.25),
        "jump": MicroSFXSpec(name: "jump", waveform: .square, frequency: 150.0, frequencyEnd: 600.0, decay: 0.18, volume: 0.2),
        "explosion": MicroSFXSpec(name: "explosion", waveform: .noise, frequency: 800.0, decay: 0.45, volume: 0.35),
        "click": MicroSFXSpec(name: "click", waveform: .sine, frequency: 500.0, frequencyEnd: 200.0, decay: 0.03, volume: 0.25)
    ]

    public func play(_ presetName: String, pitch: Float = 1.0, volume: Float = 1.0) {
        guard let spec = MicroSFX.presets[presetName.lowercased()] else {
            print("[MicroSFX] Preset not found: \(presetName)")
            return
        }

        let duration = Double(spec.attack + spec.decay + spec.release)
        let totalSamples = Int(sampleRate * duration)
        var sampleIndex = 0

        var currentFreq = spec.frequency * pitch
        var phase: Float = 0.0
        let masterVol = spec.volume * volume

        let format = AVAudioFormat(standardFormatWithSampleRate: sampleRate, channels: 1)!
        let sourceNode = AVAudioSourceNode { _, _, frameCount, audioBufferList -> OSStatus in
            let ablPointer = UnsafeMutableAudioBufferListPointer(audioBufferList)
            for frame in 0..<Int(frameCount) {
                if sampleIndex >= totalSamples {
                    for buffer in ablPointer {
                        let ptr = buffer.mData!.assumingMemoryBound(to: Float.self)
                        ptr[frame] = 0.0
                    }
                    continue
                }

                let t = Float(sampleIndex) / Float(self.sampleRate)

                if spec.jumpTime > 0 && t >= spec.jumpTime {
                    currentFreq = spec.jumpFrequency * pitch
                } else if spec.frequencyEnd > 0 {
                    let progress = t / Float(duration)
                    currentFreq = (spec.frequency * pitch) + (spec.frequencyEnd * pitch - (spec.frequency * pitch)) * progress
                }

                var env: Float = 0.0
                if t < spec.attack {
                    env = t / spec.attack
                } else {
                    env = max(0.0, 1.0 - (t - spec.attack) / (spec.decay + spec.release))
                }

                phase += (2.0 * .pi * currentFreq) / Float(self.sampleRate)
                var sample: Float = 0.0

                switch spec.waveform {
                case .sine:
                    sample = sin(phase)
                case .square:
                    sample = sin(phase) >= 0 ? 1.0 : -1.0
                case .sawtooth:
                    sample = 2.0 * (phase / (2.0 * .pi) - floor(phase / (2.0 * .pi) + 0.5))
                case .triangle:
                    sample = 2.0 * abs(2.0 * (phase / (2.0 * .pi) - floor(phase / (2.0 * .pi) + 0.5))) - 1.0
                case .noise:
                    sample = Float.random(in: -1.0...1.0)
                }

                let finalSample = sample * env * masterVol
                for buffer in ablPointer {
                    let ptr = buffer.mData!.assumingMemoryBound(to: Float.self)
                    ptr[frame] = finalSample
                }
                sampleIndex += 1
            }
            return noErr
        }

        engine.attach(sourceNode)
        engine.connect(sourceNode, to: engine.mainMixerNode, format: format)
        try? engine.start()

        DispatchQueue.main.asyncAfter(deadline: .now() + duration + 0.05) {
            self.engine.detach(sourceNode)
        }
    }
}
