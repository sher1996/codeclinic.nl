declare module 'canvas' {
  export class Canvas {
    constructor(width: number, height: number);
    getContext(contextId: '2d'): CanvasRenderingContext2D;
    toBuffer(): Buffer;
    toBuffer(mimeType: string): Buffer;
    toBuffer(mimeType: string, config: any): Buffer;
  }

  export function createCanvas(width: number, height: number): Canvas;
  export function loadImage(src: string): Promise<Image>;
  export function registerFont(path: string, options: { family: string; weight?: string; style?: string }): void;

  export class Image {
    src: string;
    width: number;
    height: number;
    complete: boolean;
    onload: (() => void) | null;
    onerror: ((err: Error) => void) | null;
  }
} 