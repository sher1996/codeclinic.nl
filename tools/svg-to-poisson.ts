import fs from 'node:fs';
import { createCanvas, loadImage } from 'canvas';
import PoissonDiskSampling from 'poisson-disk-sampling';
import { parseSVG } from 'svg-path-parser';
import { svgPathProperties as Props } from 'svg-path-properties';

const SIZE = 512;   // raster canvas (px)
const RADIUS = 6;   // min dist between points (px) → density control
const MAX_TRIES = 30;    // Poisson algo param

async function processSVG(file: string) {
  const svg = fs.readFileSync(file, 'utf8');
  const pathMatch = svg.match(/<path[^d]*d="([^"]+)"/i);
  if (!pathMatch) throw Error(`no <path> in ${file}`);

  // 1. rasterise the filled silhouette onto an off-screen canvas
  const canvas = createCanvas(SIZE, SIZE);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#000';
  ctx.translate(SIZE/2, SIZE/2);

  const p = new Props(pathMatch[1]);
  ctx.beginPath();
  const L = p.getTotalLength();
  for (let t = 0; t <= L; t += 1) {
    const {x,y} = p.getPointAtLength(t);
    const bbox = (p as any).bbox();
    ctx.lineTo(x - bbox.width/2, y - bbox.height/2);
  }
  ctx.closePath();
  ctx.fill();

  // 2. Poisson-disk sample **only where alpha > 0**
  const img = ctx.getImageData(0, 0, SIZE, SIZE).data;
  const isInside = (x: number, y: number) => img[(~~x + ~~y*SIZE)*4 + 3] > 0;

  const pds = new PoissonDiskSampling(
    { shape:[SIZE,SIZE], minDistance:RADIUS, tries:MAX_TRIES }
  );
  const points = pds.fill().filter(([x,y]) => isInside(x,y));

  // 3. normalise to [-1,1] space for your shader & dump
  const pts = points.flatMap(([x,y]) => [
    (x - SIZE/2) / (SIZE/2),
    (-y + SIZE/2) / (SIZE/2),
    0
  ]);

  const out = `public/shapes/${file.split('/').pop()?.replace('.svg','.json')}`;
  fs.writeFileSync(out, JSON.stringify(pts));
  console.log(`${out} : ${pts.length/3} pts`);
}

// Process all SVG files passed as arguments
const files = process.argv.slice(2);
if (files.length === 0) {
  console.error('Please provide SVG files as arguments');
  process.exit(1);
}

Promise.all(files.map(processSVG)).catch(console.error); 