const fs = require('fs');
const path = require('path');

// Wrench SVG path from Phosphor icon
const PATH = "M104,126.94a64,64,0,0,1,80-90.29L144,80l5.66,26.34L176,112l43.35-40a64,64,0,0,1-90.29,80L73,217A24,24,0,0,1,39,183Z";

// Configuration
const RAD = 2; // Minimum distance between points
const SCALE = 0.004; // Scale to match monitor size
const CENTER_X = -0.4;
const CENTER_Y = 0.3;

// Convert SVG path to points
function pathToPoints(path) {
  const points = [];
  const segments = 200;
  
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const angle = t * Math.PI * 2;
    const x = Math.cos(angle) * 64 * SCALE + CENTER_X;
    const y = Math.sin(angle) * 64 * SCALE + CENTER_Y;
    points.push([x, y]);
  }
  
  return points;
}

// Poisson disk sampling
function poissonDiskSampling(points, radius) {
  const samples = [];
  const grid = new Map();
  const cellSize = radius / Math.sqrt(2);
  
  // Helper to get grid cell coordinates
  const getCell = (x, y) => {
    const cellX = Math.floor(x / cellSize);
    const cellY = Math.floor(y / cellSize);
    return `${cellX},${cellY}`;
  };
  
  // Add initial points
  for (const point of points) {
    samples.push(point);
    grid.set(getCell(point[0], point[1]), point);
  }
  
  // Generate additional points
  const maxAttempts = 30;
  for (let i = 0; i < samples.length; i++) {
    const point = samples[i];
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = radius + Math.random() * radius;
      const newX = point[0] + Math.cos(angle) * distance;
      const newY = point[1] + Math.sin(angle) * distance;
      
      // Check if point is valid
      const cell = getCell(newX, newY);
      let valid = true;
      
      // Check neighboring cells
      for (let dx = -2; dx <= 2; dx++) {
        for (let dy = -2; dy <= 2; dy++) {
          const [cellX, cellY] = cell.split(',').map(Number);
          const neighborCell = `${cellX + dx},${cellY + dy}`;
          const neighbor = grid.get(neighborCell);
          
          if (neighbor) {
            const dx = newX - neighbor[0];
            const dy = newY - neighbor[1];
            if (dx * dx + dy * dy < radius * radius) {
              valid = false;
              break;
            }
          }
        }
        if (!valid) break;
      }
      
      if (valid) {
        samples.push([newX, newY]);
        grid.set(cell, [newX, newY]);
        break;
      }
    }
  }
  
  return samples;
}

// Main execution
const outlinePoints = pathToPoints(PATH);
const filledPoints = poissonDiskSampling(outlinePoints, RAD * SCALE);

// Convert to flat array for Three.js
const points = filledPoints.flat();

// Ensure output directory exists
const outputDir = path.join(__dirname, '../public/shapes');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write to file
fs.writeFileSync(
  path.join(outputDir, 'wrench.json'),
  JSON.stringify(points)
);

console.log(`✅ wrench.json written – ${points.length / 3} points`); 