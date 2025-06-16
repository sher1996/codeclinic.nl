declare module 'svg-path-parser' {
  interface SVGPathCommand {
    code: string;
    command: string;
    relative?: boolean;
    x?: number;
    y?: number;
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    r?: number;
    rx?: number;
    ry?: number;
    xAxisRotation?: number;
    largeArcFlag?: boolean;
    sweepFlag?: boolean;
  }

  export function parseSVG(path: string): SVGPathCommand[];
} 