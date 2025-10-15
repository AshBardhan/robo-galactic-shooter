/**
 * TypeScript definitions for riffwave.js
 * Audio encoder for HTML5 <audio> elements
 */

declare namespace riffwave {
  interface Header {
    chunkId: number[];
    chunkSize: number;
    format: number[];
    subChunk1Id: number[];
    subChunk1Size: number;
    audioFormat: number;
    numChannels: number;
    sampleRate: number;
    byteRate: number;
    blockAlign: number;
    bitsPerSample: number;
    subChunk2Id: number[];
    subChunk2Size: number;
  }

  interface FastBase64 {
    chars: string;
    encLookup: string[];
    Init(): void;
    Encode(src: number[]): string;
  }

  interface RIFFWAVE {
    data: number[];
    wav: number[];
    dataURI: string;
    header: Header;
    clipping?: number;
    buffer?: Float32Array;
    Make(data: number[] | Float32Array): void;
    getAudio?(): HTMLAudioElement | AudioBufferSourceNode | null;
  }

  interface RIFFWAVEConstructor {
    new (data?: number[]): RIFFWAVE;
  }
}

declare module 'riffwave' {
  const RIFFWAVE: riffwave.RIFFWAVEConstructor;
  export = RIFFWAVE;
}
