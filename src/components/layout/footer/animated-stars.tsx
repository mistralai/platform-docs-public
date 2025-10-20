'use client';
import React from 'react';
import { useTheme } from 'next-themes';

interface Star {
  x: number;
  y: number;
  baseOpacity: number;
  currentOpacity: number;
  pulseSpeed: number;
  pulsePhase: number;
  lifetime: number;
  maxLifetime: number;
  sizeMultiplier: number;
}

interface AnimatedStarsBackgroundProps {
  /**
   * Star density - number of pixels per star (lower = more dense)
   * @default 2500
   */
  density?: number;
  /**
   * Maximum opacity for stars at the bottom
   * @default 1.0
   */
  maxOpacity?: number;
  /**
   * Minimum opacity for stars at the top
   * @default 0.05
   */
  minOpacity?: number;
  /**
   * Chance of new star spawning per frame (0-1)
   * @default 0.03
   */
  spawnRate?: number;
  /**
   * Minimum star lifetime in milliseconds
   * @default 8000
   */
  minLifetime?: number;
  /**
   * Maximum star lifetime in milliseconds
   * @default 20000
   */
  maxLifetime?: number;
}

const AnimatedStarsBackground: React.FC<AnimatedStarsBackgroundProps> = ({
  density = 2000,
  maxOpacity = 1.0,
  minOpacity = 0.05,
  spawnRate = 0.03,
  minLifetime = 18000,
  maxLifetime = 29000,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();
  const animationRef = React.useRef<number | null>(null);
  const starsRef = React.useRef<Star[]>([]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clean up any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    // Clear canvas and reset stars
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    starsRef.current = [];

    // Wait for theme to be resolved before doing anything
    if (!resolvedTheme) {
      return;
    }

    // Only render stars in dark mode
    if (resolvedTheme !== 'dark') {
      return;
    }

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      // Calculate footer height dynamically or use a reasonable default
      const footerElement = canvas.closest('footer');
      canvas.height = footerElement ? footerElement.offsetHeight : 800;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Generate a new star
    const generateStar = (): Star => {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;

      // Calculate base opacity based on y position (higher y = higher opacity)
      // Stars at top (y=0) should be nearly invisible, stars at bottom should be bright
      const baseOpacity =
        minOpacity + (y / canvas.height) * (maxOpacity - minOpacity);

      return {
        x,
        y,
        baseOpacity,
        currentOpacity: baseOpacity,
        pulseSpeed: 0.008 + Math.random() * 0.012, // Smooth random pulse speed
        pulsePhase: Math.random() * Math.PI * 2, // Random starting phase
        lifetime: 0,
        maxLifetime: minLifetime + Math.random() * (maxLifetime - minLifetime),
        sizeMultiplier: 0.5 + Math.random() * 1.0, // Size variation: 0.5 to 1.5
      };
    };

    // Calculate target number of stars (used for spawn limit)
    const numberOfStars = Math.floor((canvas.width * canvas.height) / density);
    // Start with 0 stars - let them appear gradually through the spawn mechanism

    // Animation loop
    const animate = (timestamp: number) => {
      // Check dark mode on each frame - stop animation if not dark mode or theme undefined
      if (!resolvedTheme || resolvedTheme !== 'dark') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw existing stars
      starsRef.current = starsRef.current.filter(star => {
        star.lifetime += 32; // Faster lifetime progression
        star.pulsePhase += star.pulseSpeed;

        // Calculate fade based on lifetime (no more opacity pulsing, using aura instead)
        const lifetimeProgress = star.lifetime / star.maxLifetime;
        let fadeMultiplier = 1;

        if (lifetimeProgress > 0.8) {
          // Fade out in the last 20% of lifetime
          fadeMultiplier = 1 - (lifetimeProgress - 0.8) / 0.2;
        } else if (lifetimeProgress < 0.4) {
          // Fade in during the first 40% of lifetime (much longer)
          fadeMultiplier = lifetimeProgress / 0.4;
        }

        star.currentOpacity = star.baseOpacity * fadeMultiplier;

        // Draw star with pixel aura shining effect
        const baseSize = 4; // Fixed base size: 4x4 pixels
        const size = Math.max(1, Math.round(baseSize * star.sizeMultiplier)); // Apply size variation (0.5 - 1.5), minimum 1px
        const x = Math.floor(star.x);
        const y = Math.floor(star.y);

        // Calculate aura intensity based on pulse
        const auraIntensity =
          0.3 + 0.7 * (Math.sin(star.pulsePhase) * 0.5 + 0.5);

        // Draw outer aura (2-3 pixels around the star)
        const auraSize = size + 2;
        const auraOpacity = star.currentOpacity * auraIntensity * 0.3;
        ctx.fillStyle = `rgba(255, 255, 255, ${auraOpacity})`;
        ctx.fillRect(x - 1, y - 1, auraSize, auraSize);

        // Draw inner glow (1 pixel around the star)
        const glowSize = size + 1;
        const glowOpacity = star.currentOpacity * auraIntensity * 0.6;
        ctx.fillStyle = `rgba(255, 255, 255, ${glowOpacity})`;
        ctx.fillRect(x - 0.5, y - 0.5, glowSize, glowSize);

        // Draw main star (full opacity)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.currentOpacity})`;
        ctx.fillRect(x, y, size, size);

        // Remove star if lifetime exceeded
        return star.lifetime < star.maxLifetime;
      });

      // Add new stars occasionally - more aggressive spawning when few stars exist
      const currentStarCount = starsRef.current.length;
      const targetStars = numberOfStars;
      const spawnChance =
        currentStarCount < targetStars * 0.3
          ? spawnRate * 8 // Much faster spawning when under 30% capacity
          : currentStarCount < targetStars * 0.7
          ? spawnRate * 3 // Faster spawning when under 70% capacity
          : spawnRate; // Normal spawning when near capacity

      if (Math.random() < spawnChance && currentStarCount < targetStars * 1.5) {
        starsRef.current.push(generateStar());
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(() => animate(0));

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [
    density,
    maxOpacity,
    minOpacity,
    spawnRate,
    minLifetime,
    maxLifetime,
    resolvedTheme,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 dark:block hidden"
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

export default AnimatedStarsBackground;
