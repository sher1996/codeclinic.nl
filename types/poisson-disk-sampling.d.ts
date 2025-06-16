declare module 'poisson-disk-sampling' {
  interface Options {
    shape: number[];
    minDistance: number;
    maxDistance?: number;
    tries?: number;
    bias?: number;
  }

  class PoissonDiskSampling {
    constructor(options: Options);
    fill(): number[][];
    getAllPoints(): number[][];
    getNextPoint(): number[] | null;
    reset(): void;
  }

  export = PoissonDiskSampling;
} 