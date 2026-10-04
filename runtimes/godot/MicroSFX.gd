extends Node

# MicroSFX - Zero-asset procedural audio engine for Godot 4
# Usage:
#   MicroSFX.play("coin")
#   MicroSFX.play("laser", 1.2, 0.8)

class_name MicroSFX

enum Waveform { SINE, SQUARE, SAWTOOTH, TRIANGLE, NOISE }

class SoundSpec:
	var name: String
	var waveform: int
	var frequency: float
	var frequency_end: float = 0.0
	var jump_time: float = 0.0
	var jump_frequency: float = 0.0
	var attack: float = 0.005
	var decay: float = 0.15
	var release: float = 0.05
	var volume: float = 0.3

	func _init(n: String, w: int, f: float, vol: float = 0.3):
		name = n
		waveform = w
		frequency = f
		volume = vol

static var presets: Dictionary = {}

static func _static_init() -> void:
	# Coin
	var coin = SoundSpec.new("coin", Waveform.SQUARE, 987.77, 0.3)
	coin.jump_time = 0.08
	coin.jump_frequency = 1318.51
	coin.decay = 0.25
	presets["coin"] = coin

	# Laser
	var laser = SoundSpec.new("laser", Waveform.SAWTOOTH, 880.0, 0.3)
	laser.frequency_end = 110.0
	laser.decay = 0.15
	presets["laser"] = laser

	# Jump
	var jump = SoundSpec.new("jump", Waveform.SQUARE, 150.0, 0.25)
	jump.frequency_end = 600.0
	jump.decay = 0.18
	presets["jump"] = jump

	# Click
	var click = SoundSpec.new("click", Waveform.SINE, 500.0, 0.25)
	click.frequency_end = 200.0
	click.decay = 0.03
	presets["click"] = click

	# Explosion
	var exp = SoundSpec.new("explosion", Waveform.NOISE, 800.0, 0.4)
	exp.decay = 0.45
	presets["explosion"] = exp

static func play(preset_name: String, tree: SceneTree, pitch: float = 1.0, volume: float = 1.0) -> void:
	var key = preset_name.to_lower()
	if not presets.has(key):
		push_warning("[MicroSFX] Preset not found: " + preset_name)
		return

	var spec: SoundSpec = presets[key]
	var sample_rate: float = 44100.0
	var duration: float = spec.attack + spec.decay + spec.release
	var total_frames: int = int(sample_rate * duration)

	var generator = AudioStreamGenerator.new()
	generator.mix_rate = sample_rate
	generator.buffer_length = duration + 0.05

	var player = AudioStreamPlayer.new()
	player.stream = generator
	tree.root.add_child(player)
	player.play()

	var playback: AudioStreamGeneratorPlayback = player.get_stream_playback()
	var base_freq: float = spec.frequency * pitch
	var current_freq: float = base_freq
	var phase: float = 0.0
	var master_vol: float = spec.volume * volume

	for i in range(total_frames):
		var t: float = float(i) / sample_rate

		if spec.jump_time > 0 and t >= spec.jump_time:
			current_freq = spec.jump_frequency * pitch
		elif spec.frequency_end > 0:
			var progress: float = t / duration
			current_freq = lerp(base_freq, spec.frequency_end * pitch, progress)

		var env: float = 0.0
		if t < spec.attack:
			env = t / spec.attack
		else:
			env = max(0.0, 1.0 - (t - spec.attack) / (spec.decay + spec.release))

		phase += (TAU * current_freq) / sample_rate
		if phase >= TAU:
			phase -= TAU

		var sample: float = 0.0
		match spec.waveform:
			Waveform.SINE:
				sample = sin(phase)
			Waveform.SQUARE:
				sample = 1.0 if sin(phase) >= 0 else -1.0
			Waveform.SAWTOOTH:
				sample = 2.0 * (phase / TAU) - 1.0
			Waveform.TRIANGLE:
				sample = 2.0 * abs(2.0 * (phase / TAU) - 1.0) - 1.0
			Waveform.NOISE:
				sample = randf_range(-1.0, 1.0)

		var frame = Vector2(sample, sample) * env * master_vol
		playback.push_frame(frame)

	# Clean up player when done
	await tree.create_timer(duration + 0.1).timeout
	player.queue_free()
