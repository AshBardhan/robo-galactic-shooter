/**
 * TypeScript definitions for riffwave.js
 * Audio encoder for HTML5 <audio> elements
 */

declare module '*/riffwave.js' {
  interface RIFFWAVEHeader {
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

  class RIFFWAVE {
    data: number[];
    wav: number[];
    dataURI: string;
    header: RIFFWAVEHeader;
    clipping?: number;
    buffer?: Float32Array;

    constructor(data?: number[]);
    Make(data: number[] | Float32Array): void;
    getAudio?(): HTMLAudioElement | AudioBufferSourceNode | null;
  }

  export default RIFFWAVE;
}
