/**
 * TypeScript definitions for sfxr.js
 * Sound effect generation library
 */

declare namespace sfxr {
  // Wave shape constants
  interface WaveformConstants {
    SQUARE: number;
    SAWTOOTH: number;
    SINE: number;
    NOISE: number;
  }

  // Sound generation parameters interface
  interface Params {
    oldParams: boolean;

    // Wave shape
    wave_type: number;

    // Envelope parameters
    p_env_attack: number;
    p_env_sustain: number;
    p_env_punch: number;
    p_env_decay: number;

    // Tone parameters
    p_base_freq: number;
    p_freq_limit: number;
    p_freq_ramp: number;
    p_freq_dramp: number;

    // Vibrato parameters
    p_vib_strength: number;
    p_vib_speed: number;

    // Tonal change parameters
    p_arp_mod: number;
    p_arp_speed: number;

    // Square wave duty parameters
    p_duty: number;
    p_duty_ramp: number;

    // Repeat parameters
    p_repeat_speed: number;

    // Flanger parameters
    p_pha_offset: number;
    p_pha_ramp: number;

    // Low-pass filter parameters
    p_lpf_freq: number;
    p_lpf_ramp: number;
    p_lpf_resonance: number;

    // High-pass filter parameters
    p_hpf_freq: number;
    p_hpf_ramp: number;

    // Sample parameters
    sound_vol: number;
    sample_rate: number;
    sample_size: number;

    // Preset generation methods
    pickupCoin(): this;
    laserShoot(): this;
    explosion(): this;
    powerUp(): this;
    hitHurt(): this;
    jump(): this;
    blipSelect(): this;
    mutate(): this;
    random(): this;
    synth(): this;
    tone(): this;

    // Serialization methods
    toB58(): string;
    fromB58(b58encoded: string): this;
    fromJSON(struct: Record<string, any>): this;
  }

  interface ParamsConstructor {
    new (): Params;
  }

  // Sound effect generation interface
  interface SoundEffect {
    parameters: Params;
    waveShape: number;
    fltw: number;
    enableLowPassFilter: boolean;
    fltw_d: number;
    fltdmp: number;
    flthp: number;
    flthp_d: number;
    vibratoSpeed: number;
    vibratoAmplitude: number;
    envelopeLength: number[];
    envelopePunch: number;
    flangerOffset: number;
    flangerOffsetSlide: number;
    repeatTime: number;
    gain: number;
    sampleRate: number;
    bitsPerChannel: number;
    elapsedSinceRepeat: number;
    period: number;
    periodMax: number;
    enableFrequencyCutoff: boolean;
    periodMult: number;
    periodMultSlide: number;
    dutyCycle: number;
    dutyCycleSlide: number;
    arpeggioMultiplier: number;
    arpeggioTime: number;

    init(ps: Params): void;
    initForRepeat(): void;
    getRawBuffer(): {buffer: number[]; clipped: number};
    generate(): any; // Returns RIFFWAVE instance with additional properties
  }

  interface SoundEffectConstructor {
    new (ps: Params | string): SoundEffect;
  }

  // Main sfxr API interface
  interface SfxrAPI {
    toBuffer(synthdef: Params | string): number[];
    toWebAudio(synthdef: Params | string, audiocontext?: AudioContext): AudioBufferSourceNode | undefined;
    toWave(synthdef: Params | string): any;
    toAudio(synthdef: Params | string): HTMLAudioElement | AudioBufferSourceNode | null;
    b58decode(b58encoded: string): Record<string, any>;
  }
}

declare module 'sfxr' {
  export const waveforms: sfxr.WaveformConstants;
  export const Params: sfxr.ParamsConstructor;
  export const SoundEffect: sfxr.SoundEffectConstructor;
  export const sfxr: sfxr.SfxrAPI;
}
