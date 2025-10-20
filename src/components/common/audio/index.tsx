'use client';
import * as React from 'react';
import { useRef, useMemo, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { PauseIcon } from 'lucide-react';
import { useWavesurfer } from '@wavesurfer/react';
import { useTheme } from 'next-themes';
import { PlayIcon } from '@/components/icons/pixel';

const colors = {
  light: { wave: 'rgba(100,100,100,1)', progress: 'rgba(0,0,0,1)' },
  dark: { wave: 'rgba(100,100,100,1)', progress: 'rgba(255,255,255,1)' },
};

export function AudioPlayer(
  props: React.DetailedHTMLProps<
    React.AudioHTMLAttributes<HTMLAudioElement>,
    HTMLAudioElement
  >
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [src, setSrc] = useState('');
  const { theme } = useTheme();

  // read <source> once
  useEffect(() => {
    const el = audioRef.current;
    const source = el?.querySelector('source') as HTMLSourceElement | null;
    if (source?.src) setSrc(source.src);
  }, []);
  // 1) Add placeholder peaks (deterministic, looks like a waveform)
  const placeholderPeaks = useMemo(() => {
    const N = 1024; // keep it ~1k for speed
    let seed = 1;
    for (let i = 0; i < src.length; i++)
      seed = (seed * 31 + src.charCodeAt(i)) >>> 0;
    const rnd = () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32;
    const arr = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const t = i / (N - 1);
      const env = Math.sin(Math.PI * t) ** 0.7;
      arr[i] = Math.max(0.06, env * (0.5 + 0.4 * rnd())); // [0..1]
    }
    return [arr]; // mono channel
  }, [src]);

  // 2) Your custom renderer: skeleton ALSO uses the same path, so it always draws
  const animStartRef = useRef<number | null>(null);
  const animDoneRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  // --- corrected renderFunction (no extra normalization) ---
  const renderFunction = useMemo(() => {
    const introMs = 350;
    const delayPerBar = 8;
    const minBarPx = 2; // keep super-quiet sections visible
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    return (
      peaks: Array<Float32Array | number[]>,
      ctx: CanvasRenderingContext2D
    ) => {
      const W = ctx.canvas.width;
      const H = ctx.canvas.height;

      // WaveSurfer gives pixel-aligned peaks; use channel 0
      const ch = peaks?.[0] as Float32Array | number[] | undefined;

      // If nothing yet, fall back to placeholder immediately
      const drawFrom =
        ch && ch.length
          ? ch
          : (placeholderRef.current?.[0] as
              | Float32Array
              | number[]
              | undefined);
      if (!drawFrom || !drawFrom.length) return;

      const barWidth = 4,
        barGap = 4,
        step = barWidth + barGap;
      const bars = Math.max(1, Math.floor(W / step));
      const L = drawFrom.length;

      // Map pixel-peaks → our bars: take MAX abs value in each window (no averaging)
      const samplesPerBar = Math.max(1, Math.floor(L / bars));

      ctx.clearRect(0, 0, W, H);

      // time-based stagger on first paint(s)
      const now = performance.now();
      if (animStartRef.current == null) animStartRef.current = now;
      const start = animStartRef.current;

      for (let i = 0; i < bars; i++) {
        const off = i * samplesPerBar;
        const end = Math.min(L, off + samplesPerBar);

        let maxAbs = 0;
        for (let k = off; k < end; k++) {
          const a = Math.abs(Number(drawFrom[k]));
          if (a > maxAbs) maxAbs = a; // already in [0..1] because normalize: true
        }

        // convert amplitude → pixels (symmetrical around center)
        const shaped = Math.pow(maxAbs, 0.3);
        const fullH = Math.max(minBarPx, shaped * H);
        // staggered intro
        const elapsed = now - start - i * delayPerBar;
        const t = Math.max(0, Math.min(1, elapsed / introMs));
        const s = easeOutCubic(t);

        const h = Math.max(minBarPx, fullH * s);
        const y = (H - h) / 2;
        const x = i * step;

        ctx.fillRect(x, y, barWidth, h);
      }

      const lastElapsed = now - (start + (bars - 1) * delayPerBar);
      animDoneRef.current = lastElapsed >= introMs;
    };
  }, []);

  // keep normalize: true in your wavesurfer options
  const { isPlaying, currentTime, wavesurfer } = useWavesurfer({
    container: containerRef,
    height: 30,
    normalize: true, // <-- important: we'll trust WS's scaling
    barWidth: 4,
    barGap: 4,
    barRadius: 0,
    peaks: placeholderPeaks, // instant non-empty canvas
    waveColor: colors.light.wave,
    progressColor: colors.light.progress,
    cursorColor: colors.light.progress,
    renderFunction, // defined below
  });

  // keep a ref to compare whether we're drawing placeholder or real peaks
  const placeholderRef = useRef<Float32Array[] | number[][] | null>(null);
  placeholderRef.current = placeholderPeaks;

  // 4) After mount, load the REAL url → replaces peaks when decoded
  useEffect(() => {
    if (!wavesurfer || !src) return;
    // restart intro animation for real peaks
    animStartRef.current = null;
    animDoneRef.current = false;
    wavesurfer.load(src);
  }, [wavesurfer, src]);

  // 5) Tiny RAF to drive the intro easing
  useEffect(() => {
    if (!wavesurfer) return;
    const tick = () => {
      if (!wavesurfer) return;
      wavesurfer.setOptions({}); // trigger redraw
      if (!animDoneRef.current) rafRef.current = requestAnimationFrame(tick);
    };
    // start immediately (for placeholder), and again on 'ready' (for real peaks)
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);

    const onReady = () => {
      animStartRef.current = null;
      animDoneRef.current = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    wavesurfer.on('ready', onReady);
    return () => {
      wavesurfer.un('ready', onReady);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [wavesurfer]);

  // 6) Theme colors still updated without re-init (unchanged)
  useEffect(() => {
    if (!wavesurfer) return;
    const t = (theme === 'dark' ? 'dark' : 'light') as keyof typeof colors;
    wavesurfer.setOptions({
      waveColor: colors[t].wave,
      progressColor: colors[t].progress,
      cursorColor: colors[t].progress,
    });
  }, [theme, wavesurfer]);

  const formatTime = (time: number) => {
    if (!isFinite(time) || isNaN(time)) return '0:00';
    const m = Math.floor(time / 60);
    const s = Math.floor(time % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-14 flex my-[2em] items-center w-full sm:w-sm bg-secondary rounded-sm border border-border">
      <div className="flex items-center gap-3 flex-1 px-4">
        <Button
          onClick={() => wavesurfer?.playPause()}
          size="icon"
          className="size-8"
        >
          {isPlaying ? (
            <PauseIcon className="w-3 h-3" />
          ) : (
            <PlayIcon className="w-3 h-3" />
          )}
        </Button>
        <div ref={containerRef} className="w-full h-full" />
        <div className="text-sm text-foreground font-mono min-w-[4ch] text-right flex-shrink-0 w-[4ch]">
          {formatTime(currentTime)}
        </div>
        <audio preload="metadata" hidden {...props} ref={audioRef} />
      </div>
    </div>
  );
}
