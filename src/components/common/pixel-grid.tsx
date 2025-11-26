'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface PixelGridProps {
  pixelSize?: number;
  className?: string;
  opacity?: number;
  speed?: number; // Animation speed multiplier
  randomness?: number; // Random factor intensity (0-1)
  forceVisible?: boolean;
}

// Simple Perlin noise implementation
class PerlinNoise {
  private permutation: number[];
  private p: number[];

  constructor() {
    this.permutation = [
      151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225,
      140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247,
      120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177,
      33, 88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165,
      71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122, 60, 211,
      133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25,
      63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
      135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217,
      226, 250, 124, 123, 5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206,
      59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213, 119, 248,
      152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22,
      39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218,
      246, 97, 228, 251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241,
      81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31, 181, 199, 106, 157,
      184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93,
      222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180,
    ];

    this.p = new Array(512);
    for (let i = 0; i < 512; i++) {
      this.p[i] = this.permutation[i & 255];
    }
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(t: number, a: number, b: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number, z: number): number {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise(x: number, y: number, z: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;

    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);

    const u = this.fade(x);
    const v = this.fade(y);
    const w = this.fade(z);

    const A = this.p[X] + Y;
    const AA = this.p[A] + Z;
    const AB = this.p[A + 1] + Z;
    const B = this.p[X + 1] + Y;
    const BA = this.p[B] + Z;
    const BB = this.p[B + 1] + Z;

    return this.lerp(
      w,
      this.lerp(
        v,
        this.lerp(
          u,
          this.grad(this.p[AA], x, y, z),
          this.grad(this.p[BA], x - 1, y, z)
        ),
        this.lerp(
          u,
          this.grad(this.p[AB], x, y - 1, z),
          this.grad(this.p[BB], x - 1, y - 1, z)
        )
      ),
      this.lerp(
        v,
        this.lerp(
          u,
          this.grad(this.p[AA + 1], x, y, z - 1),
          this.grad(this.p[BA + 1], x - 1, y, z - 1)
        ),
        this.lerp(
          u,
          this.grad(this.p[AB + 1], x, y - 1, z - 1),
          this.grad(this.p[BB + 1], x - 1, y - 1, z - 1)
        )
      )
    );
  }
}

export function PixelGrid({
  pixelSize = 12,
  opacity = 0.5,
  speed = 1.8,
  randomness = 0.8,
  forceVisible = false,
  className,
}: PixelGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const noiseRef = useRef<PerlinNoise>(new PerlinNoise());
  const startTimeRef = useRef<number>(Date.now());
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();

  // Listen to parent hover events
  useEffect(() => {
    if (forceVisible) {
      setIsVisible(true);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const parent = container.parentElement;
    if (!parent) return;

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    parent.addEventListener('mouseenter', handleMouseEnter);
    parent.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      parent.removeEventListener('mouseenter', handleMouseEnter);
      parent.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [forceVisible]);

  useEffect(() => {
    if (!isVisible) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set pixelated rendering for crisp edges
    ctx.imageSmoothingEnabled = false;

    // Set canvas size to match its container size
    const resizeCanvas = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    resizeCanvas();

    const animate = () => {
      if (!isVisible) return;

      const now = Date.now();
      const elapsed = (now - startTimeRef.current) * 0.001; // Convert to seconds

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate grid dimensions
      const cols =
        Math.ceil(canvas.width / (pixelSize * (window.devicePixelRatio || 1))) +
        1;
      const rows =
        Math.ceil(
          canvas.height / (pixelSize * (window.devicePixelRatio || 1))
        ) + 1;

      // Generate pixels with Perlin noise
      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          // Use Perlin noise to determine pixel intensity
          const noiseValue = noiseRef.current.noise(
            x * 0.2, // Increased scale for smaller, more detailed patterns
            y * 0.2,
            elapsed * 0.5 * speed // Time component for animation with speed control
          );

          // Add random factor to break up the smooth patterns
          // Use position-based seed for consistent but varied randomness per pixel
          const randomSeed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
          const baseRandom = (randomSeed - Math.floor(randomSeed)) * 2 - 1; // -1 to 1
          const randomFactor = baseRandom * randomness; // Scale by randomness parameter
          const adjustedNoise = noiseValue + randomFactor;

          // Normalize noise value to 0-1 range
          const intensity = (adjustedNoise + 1) * 0.75;

          // Simple wave from center when component is visible
          const pixelX = (x + 0.5) / cols;
          const pixelY = (y + 0.5) / rows;

          // Calculate distance accounting for aspect ratio to ensure perfect circles
          const aspectRatio = cols / rows;
          const deltaX = (pixelX - 0.5) * aspectRatio;
          const deltaY = pixelY - 0.5;
          const baseDistance =
            Math.sqrt(deltaX * deltaX + deltaY * deltaY) / aspectRatio;

          // Apply random factor to wave distance for organic expansion
          const pixelSeed = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
          const pixelRandom = pixelSeed - Math.floor(pixelSeed);
          const organicRandomFactor = (pixelRandom - 0.5) * randomness * 3.5; // Use same randomness parameter
          const organicDistance = baseDistance + organicRandomFactor * 0.1; // Scale the random effect

          const waveSpeed = 0.5; // Faster wave
          const rawProgress = elapsed * waveSpeed;

          // Ease-out function (cubic ease-out)
          const easeOut = (t: number) => 1 - Math.pow(1 - Math.min(t, 1), 3);
          const waveRadius = easeOut(rawProgress);

          const fadeWidth = 0.08;

          let pixelOpacity = 0;
          if (organicDistance <= waveRadius) {
            pixelOpacity = 1;
          } else if (organicDistance <= waveRadius + fadeWidth) {
            const fadeDistance = organicDistance - waveRadius;
            pixelOpacity = 1 - fadeDistance / fadeWidth;
          }

          // Create grayscale pixels from white to black
          const grayValue = Math.floor(intensity * 255);
          const pixelColor = `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${pixelOpacity})`;

          ctx.fillStyle = pixelColor;
          ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    // Start animation
    startTimeRef.current = Date.now();
    animate();

    // Handle resize with ResizeObserver for better container size detection
    let resizeObserver: ResizeObserver | null = null;

    if (window.ResizeObserver && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        resizeCanvas();
      });
      resizeObserver.observe(containerRef.current);
    }

    // Fallback to window resize for older browsers
    const handleWindowResize = () => resizeCanvas();
    window.addEventListener('resize', handleWindowResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [isVisible, pixelSize]);

  return (
    <div
      ref={containerRef}
      className={cn(
        'absolute inset-0 pointer-events-none mix-blend-luminosity dark:mix-blend-overlay',
        className
      )}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.canvas
            ref={canvasRef}
            initial={{ opacity: theme === 'dark' ? opacity : opacity / 2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cn('absolute inset-0')}
            style={{
              width: '100%',
              height: '100%',
              imageRendering: 'pixelated',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
