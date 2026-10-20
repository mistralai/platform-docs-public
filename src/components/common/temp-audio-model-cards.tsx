'use client';

// TEMP (DOC-610): Voxtral 3 model cards for the Audio overview until the real
// model entries land in src/schema/models. These objects are not registered, so
// they stay off the catalog, model pages, pricing, and the home page. Cards link
// to the feature overviews because /models/<slug> does not exist yet.
// Remove before launch: grep -rn "TempAudioModelCards" src.

import { useLingo } from '@lingo.dev/react';
import type { Model } from '@/schema';
import { ModelCard } from '@/components/model/model-card';

type Group = 'stt' | 'tts';

interface TempAudioModel {
  name: string;
  slug: string;
  group: Group;
  href: string;
  shortDescription: string;
}

// Display names and use cases: RFC-618 (final IDs confirmed by Rakesh, Oct 7).
const TEMP_AUDIO_MODELS: TempAudioModel[] = [
  {
    name: 'Voxtral Mini Transcribe 3',
    slug: 'voxtral-mini-transcribe-3-0',
    group: 'stt',
    href: '/studio/audio/speech-to-text/overview',
    shortDescription: 'Transcription of recorded audio files.',
  },
  {
    name: 'Voxtral Mini Transcribe Realtime 3',
    slug: 'voxtral-mini-transcribe-realtime-3-0',
    group: 'stt',
    href: '/studio/audio/speech-to-text/overview',
    shortDescription: 'Live transcription of audio streams, with configurable latency.',
  },
  {
    // RFC-618 also lists translation, speech Q&A, summarization, and function
    // calling. PENDING Rakesh: no chat or audio capability on the API (Oct 7).
    name: 'Voxtral Small Transcribe 3',
    slug: 'voxtral-small-transcribe-3-0',
    group: 'stt',
    href: '/studio/audio/speech-to-text/overview',
    shortDescription: 'Higher-quality transcription of recorded audio files.',
  },
  {
    name: 'Voxtral TTS 3',
    slug: 'voxtral-mini-tts-3-0',
    group: 'tts',
    href: '/studio/audio/text-to-speech/overview',
    shortDescription: 'Speech generation from text, with preset voices and zero-shot voice cloning.',
  },
  {
    // PENDING: not released yet by Science (Rakesh, Oct 7). Gregory decides what ships.
    name: 'Voxtral TTS Realtime 3',
    slug: 'voxtral-mini-tts-realtime-3-0',
    group: 'tts',
    href: '/studio/audio/text-to-speech/overview',
    shortDescription: 'Streaming speech generation for live conversations.',
  },
];

function toModel(entry: TempAudioModel): Model {
  return {
    name: entry.name,
    slug: entry.slug,
    version: '3.0',
    status: 'GA',
    avatar: { icon: 'voxtral', backgroundColor: 'pink' },
    weights: [],
    describe: () => ({
      description: entry.shortDescription,
      shortDescription: entry.shortDescription,
    }),
  } as unknown as Model;
}

export function TempAudioModelCards({
  group,
  variant = 'card',
}: {
  group?: Group;
  variant?: 'card' | 'compact';
}) {
  const l = useLingo();
  const entries = TEMP_AUDIO_MODELS.filter(entry => !group || entry.group === group);

  return (
    <div
      className={
        variant === 'card'
          ? 'not-prose grid grid-cols-1 md:grid-cols-3 gap-6 my-6'
          : 'not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-6'
      }
    >
      {entries.map(entry => (
        <ModelCard
          key={entry.slug}
          model={toModel(entry)}
          l={l}
          variant={variant}
          showParameters={variant === 'compact'}
          href={entry.href}
        />
      ))}
    </div>
  );
}
