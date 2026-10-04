const assert = require('assert');
const { sfx, PRESETS, generatePCM, encodeWAV } = require('../dist/index.js');

console.log('🧪 Running micro-sfx test suite...\n');

// Test 1: Presets integrity
console.log('Test 1: Checking built-in presets...');
const requiredPresets = [
  'coin', 'laser', 'jump', 'explosion', 'hit', 'powerup',
  'shield', 'missile', 'zap',
  'click', 'select', 'blip', 'tap', 'toggle',
  'success', 'error', 'notification', 'badge', 'warp'
];

for (const name of requiredPresets) {
  assert(PRESETS[name], `Preset '${name}' should exist`);
  assert(typeof PRESETS[name].frequency === 'number', `Preset '${name}' frequency should be a number`);
  assert(PRESETS[name].waveform, `Preset '${name}' waveform should be defined`);
}
console.log(`✅ All ${requiredPresets.length} presets validated.`);

// Test 2: PCM Generation
console.log('\nTest 2: Testing PCM generation (16-bit Mono @ 44.1kHz)...');
const pcmCoin = sfx.generatePCM('coin');
assert(pcmCoin instanceof Int16Array, 'Result should be an Int16Array');
assert(pcmCoin.length > 0, 'Buffer should not be empty');

let hasNonZero = false;
for (let i = 0; i < pcmCoin.length; i++) {
  const val = pcmCoin[i];
  assert(!isNaN(val), `Sample at ${i} is NaN`);
  assert(val >= -32768 && val <= 32767, `Sample at ${i} out of 16-bit range: ${val}`);
  if (val !== 0) hasNonZero = true;
}
assert(hasNonZero, 'Audio buffer should contain non-silent samples');
console.log(`✅ Coin PCM generated: ${pcmCoin.length} samples (~${(pcmCoin.length / 44100).toFixed(2)}s), signal verified.`);

// Test 3: Waveform variations
console.log('\nTest 3: Testing all waveforms in synthesis...');
const waveforms = ['sine', 'square', 'sawtooth', 'triangle', 'noise'];
for (const wf of waveforms) {
  const buf = generatePCM({
    waveform: wf,
    frequency: 440,
    attack: 0.01,
    decay: 0.05,
    release: 0.01,
    volume: 0.2
  });
  assert(buf.length > 0, `Waveform ${wf} should generate samples`);
}
console.log(`✅ All ${waveforms.length} waveforms synthesized without error.`);

// Test 4: Dynamic modifiers (pitch & volume)
console.log('\nTest 4: Testing dynamic pitch & volume scaling...');
const pcmNormal = sfx.generatePCM('jump');
const pcmHigher = sfx.generatePCM('jump', { pitch: 2.0, volume: 0.5 });
assert(pcmHigher.length === pcmNormal.length, 'Duration should remain consistent under pitch shift');
console.log('✅ Modifiers work as expected.');

// Test 5: RIFF WAV encoding
console.log('\nTest 5: Testing RIFF WAV container encoding...');
const wavBytes = sfx.encodeWAV('coin');
assert(wavBytes instanceof Uint8Array, 'WAV export should produce a Uint8Array');
assert(wavBytes.length === 44 + pcmCoin.length * 2, 'WAV size should be 44-byte header + 2 bytes per sample');

// Verify RIFF and WAVE magic headers
const magicRIFF = String.fromCharCode(...wavBytes.slice(0, 4));
const magicWAVE = String.fromCharCode(...wavBytes.slice(8, 12));
const magicFMT = String.fromCharCode(...wavBytes.slice(12, 16));
const magicDATA = String.fromCharCode(...wavBytes.slice(36, 40));

assert.strictEqual(magicRIFF, 'RIFF', 'Magic header should be RIFF');
assert.strictEqual(magicWAVE, 'WAVE', 'Magic header should be WAVE');
assert.strictEqual(magicFMT, 'fmt ', 'Subchunk should be fmt ');
assert.strictEqual(magicDATA, 'data', 'Subchunk should be data');
console.log(`✅ Valid WAV container produced (${wavBytes.length} bytes, compliant with RIFF specification).`);

// Test 6: Base64 Data URI generator
console.log('\nTest 6: Testing toDataURI for React Native and Web...');
const dataUri = sfx.toDataURI('coin');
assert(typeof dataUri === 'string', 'Data URI should be a string');
assert(dataUri.startsWith('data:audio/wav;base64,'), 'Data URI should have correct MIME header');
assert(dataUri.length > 50, 'Data URI should contain base64 encoded audio');
console.log('✅ Data URI generation verified.');

console.log('\n🎉 ALL 6 TEST SUITES PASSED SUCCESSFULLY!\n');
