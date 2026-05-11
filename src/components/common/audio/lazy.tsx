'use client';

import dynamic from 'next/dynamic';

// Client-side lazy wrapper so wavesurfer.js stays out of every page bundle.
export const AudioPlayer = dynamic(
  () => import('./index').then(m => m.AudioPlayer),
  { ssr: false }
);
