/**
 * Extracts individual 24x24 icons from the technology icons sprite sheet SVG.
 * Each icon is identified by its position in the grid and saved as a React component.
 *
 * Usage: npx tsx src/scripts/extract-icons.ts < path-to-sprite.svg
 */

import fs from 'fs';
import path from 'path';

const SVG_INPUT = process.argv[2] || 'src/assets/technology-icons-sprite.svg';
const OUTPUT_DIR = 'src/components/icons/pixel/tech';

// Read the full SVG
const svgContent = fs.readFileSync(SVG_INPUT, 'utf-8');

// Grid parameters: icons are 24x24 at spacing of ~104px horizontally
// Row y-offsets: 100, 204, 308, 412, 516, 620
// Column x-offsets vary; we detect them from clip-path rects and path coordinates

// Parse all clip-path rects to find icon positions
const clipRects: { id: string; x: number; y: number }[] = [];
const clipRegex = /<clipPath id="([^"]+)">\s*<rect[^>]*transform="translate\((\d+)\s+(\d+)\)"[^>]*\/>/g;
let match;
while ((match = clipRegex.exec(svgContent)) !== null) {
  clipRects.push({ id: match[1], x: parseInt(match[2]), y: parseInt(match[3]) });
}

// Also detect unclipped icon groups by scanning all path coordinates
// Build a set of all 24x24 grid positions that contain paths
const allPositions = new Set<string>();

// From clip rects
for (const r of clipRects) {
  allPositions.add(`${r.x},${r.y}`);
}

// Known row y-values and col x-values from the SVG structure
const ROW_YS = [100, 204, 308, 412, 516, 620];
const COL_XS = [100, 204, 308, 412, 516, 620, 724, 828, 932, 1036, 1140, 1244, 1348, 1452, 1556, 1660, 1764, 1868, 1972, 2076, 2184];

// For each grid cell, extract all paths whose coordinates fall within that 24x24 region
type PathInfo = { raw: string; coords: number[][] };

function extractNumber(s: string): number {
  return parseFloat(s);
}

// Parse all <path> and <g> elements with their coordinates
// We need to find which paths belong to which grid cell

// Strategy: for each path element, find all numeric coordinates and determine which grid cell it belongs to
const pathRegex = /<path\s+d="([^"]+)"[^/]*\/>/g;
const allPaths: { element: string; minX: number; minY: number; maxX: number; maxY: number }[] = [];

// Parse SVG path d attribute to extract coordinates
function parseDCoords(d: string): { x: number; y: number }[] {
  const coords: { x: number; y: number }[] = [];
  // Match coordinate pairs in path data
  const numRegex = /[MLHVCSQTAZ]?\s*(-?\d+\.?\d*)\s*[,\s]?\s*(-?\d+\.?\d*)?/gi;
  let m;
  let lastX = 0, lastY = 0;

  const tokens = d.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi) || [];
  for (const token of tokens) {
    const cmd = token[0].toUpperCase();
    const nums = token.slice(1).trim().match(/-?\d+\.?\d*/g)?.map(Number) || [];

    if (cmd === 'M' || cmd === 'L') {
      for (let i = 0; i < nums.length; i += 2) {
        if (i + 1 < nums.length) {
          coords.push({ x: nums[i], y: nums[i + 1] });
          lastX = nums[i]; lastY = nums[i + 1];
        }
      }
    } else if (cmd === 'H') {
      for (const n of nums) {
        coords.push({ x: n, y: lastY });
        lastX = n;
      }
    } else if (cmd === 'V') {
      for (const n of nums) {
        coords.push({ x: lastX, y: n });
        lastY = n;
      }
    }
  }
  return coords;
}

// For each grid position, collect matching path elements
const iconPaths: Map<string, string[]> = new Map();

// Initialize all grid cells
for (const y of ROW_YS) {
  for (const x of COL_XS) {
    iconPaths.set(`${x},${y}`, []);
  }
}

// Find which grid cell a set of coordinates belongs to
function findCell(coords: { x: number; y: number }[]): string | null {
  if (coords.length === 0) return null;

  const avgX = coords.reduce((s, c) => s + c.x, 0) / coords.length;
  const avgY = coords.reduce((s, c) => s + c.y, 0) / coords.length;

  let bestX = COL_XS[0], bestY = ROW_YS[0];
  let bestDist = Infinity;

  for (const cx of COL_XS) {
    for (const cy of ROW_YS) {
      // Check if average point is within this cell (with some margin)
      const centerX = cx + 12;
      const centerY = cy + 12;
      const dist = Math.abs(avgX - centerX) + Math.abs(avgY - centerY);
      if (dist < bestDist && avgX >= cx - 2 && avgX <= cx + 26 && avgY >= cy - 2 && avgY <= cy + 26) {
        bestDist = dist;
        bestX = cx;
        bestY = cy;
      }
    }
  }

  if (bestDist < 30) {
    return `${bestX},${bestY}`;
  }
  return null;
}

// Extract individual path elements (not inside clip groups)
// First handle clipped groups
const clipGroupRegex = /<g\s+clip-path="url\(#([^)]+)\)">([\s\S]*?)<\/g>/g;
const processedPaths = new Set<string>();

while ((match = clipGroupRegex.exec(svgContent)) !== null) {
  const clipId = match[1];
  const groupContent = match[2];
  const rect = clipRects.find(r => r.id === clipId);
  if (!rect) continue;

  const key = `${rect.x},${rect.y}`;
  const paths = iconPaths.get(key) || [];

  // Extract paths from group
  const innerPathRegex = /<path[^>]*\/>/g;
  let pm;
  while ((pm = innerPathRegex.exec(groupContent)) !== null) {
    paths.push(pm[0]);
    processedPaths.add(pm[0]);
  }
  iconPaths.set(key, paths);
}

// Now handle unclipped paths
const globalPathRegex = /<path\s+d="([^"]+)"([^/]*)\/>/g;
while ((match = globalPathRegex.exec(svgContent)) !== null) {
  const fullElement = match[0];
  if (processedPaths.has(fullElement)) continue;
  // Skip paths inside defs
  if (svgContent.lastIndexOf('<defs>', match.index) > svgContent.lastIndexOf('</defs>', match.index)) continue;

  const d = match[1];
  const coords = parseDCoords(d);
  const cell = findCell(coords);
  if (cell) {
    const paths = iconPaths.get(cell) || [];
    paths.push(fullElement);
    iconPaths.set(cell, paths);
  }
}

// Generate React components
fs.mkdirSync(path.resolve(OUTPUT_DIR), { recursive: true });

let indexExports: string[] = [];
let iconCount = 0;

for (const [key, paths] of iconPaths) {
  if (paths.length === 0) continue;

  const [ox, oy] = key.split(',').map(Number);
  const row = ROW_YS.indexOf(oy);
  const col = COL_XS.indexOf(ox);

  // Normalize path coordinates: shift by -ox, -oy
  const normalizedPaths = paths.map(p => {
    // Replace all coordinates in d attribute
    return p.replace(/d="([^"]+)"/, (_, d: string) => {
      const newD = d.replace(/-?\d+\.?\d*/g, (num, offset) => {
        // Determine if this is an x or y coordinate based on context
        // This is tricky - we need to track command state
        return num; // We'll handle this differently
      });
      return `d="${d}"`;
    });
  });

  // Instead of complex path rewriting, use SVG transform to translate
  const componentName = `TechIcon_r${row}_c${col}`;
  const svgPaths = paths.map(p => {
    // Convert stroke="black" to stroke="currentColor"
    return p.replace(/stroke="black"/g, 'stroke="currentColor"');
  }).join('\n      ');

  const component = `import type { SVGProps } from 'react';

export const ${componentName} = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="${ox} ${oy} 24 24" fill="none" {...props}>
      ${svgPaths}
  </svg>
);
`;

  const fileName = `tech-r${row}-c${col}.tsx`;
  fs.writeFileSync(path.resolve(OUTPUT_DIR, fileName), component);
  indexExports.push(`export { ${componentName} } from './tech-r${row}-c${col}';`);
  iconCount++;
}

// Write index
fs.writeFileSync(path.resolve(OUTPUT_DIR, 'index.ts'), indexExports.join('\n') + '\n');

console.log(`Extracted ${iconCount} icons to ${OUTPUT_DIR}/`);
console.log('Icons are named by grid position (row, col). Rename them after visual identification.');
