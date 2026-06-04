"use client"
import { usePathname } from 'next/navigation'
import { useLingo } from '@lingo.dev/react';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation.client';
import { ArrowRightIcon } from '@/components/icons/pixel';

const UTM = "?utm_source=docs&utm_medium=header_cta&utm_campaign=studio_trial"

type CtaKey =
  | 'studio'
  | 'audio'
  | 'realtime'
  | 'batch'
  | 'documentAi'
  | 'vibe'
  | 'vibeCode'
  | 'admin'

const DEFAULT_CTA = { href: "https://console.mistral.ai", key: 'studio' as CtaKey }

const CTA_BY_PATH: Record<string, { href: string; key: CtaKey }> = {

  "/studio-api/audio/speech_to_text/offline_transcription": {
    href: "https://console.mistral.ai/build/audio/speech-to-text",
    key: 'audio',
  },
  "/studio-api/audio/speech_to_text/realtime_transcription": {
    href: "https://console.mistral.ai/build/audio/realtime",
    key: 'realtime',
  },
  "/studio-api/batch-processing": {
    href: "https://console.mistral.ai/build/batches",
    key: 'batch',
  },
  "/models/overview": {
    href: "https://console.mistral.ai/build/playground",
    key: 'studio',
  },
  "/models/model-selection-guide": {
    href: "https://console.mistral.ai/build/playground",
    key: 'studio',
  },
  "/studio-api/document-processing": {
    href: "https://console.mistral.ai/build/document-ai/ocr-playground",
    key: 'documentAi',
  },
}

const CTA_BY_PREFIX: Array<{ prefix: string; href: string; key: CtaKey }> = [
  { prefix: "/vibe/code", href: "https://chat.mistral.ai/code", key: 'vibeCode' },
  { prefix: "/vibe", href: "https://chat.mistral.ai", key: 'vibe' },
  { prefix: "/admin", href: "https://admin.mistral.ai/", key: 'admin' },
]

function resolveCta(pathname: string) {
  const exact = CTA_BY_PATH[pathname]
  if (exact) return exact
  const prefixMatch = CTA_BY_PREFIX.find(({ prefix }) => pathname === prefix || pathname.startsWith(prefix + "/"))
  if (prefixMatch) return prefixMatch
  return DEFAULT_CTA
}

function useCtaLabel(key: CtaKey) {
  const l = useLingo()
  switch (key) {
    case 'audio':
      return l.text('Try our Audio API', { context: 'Call to try the audio transcription API' })
    case 'realtime':
      return l.text('Try our Realtime Audio API', { context: 'Call to try the realtime audio API' })
    case 'batch':
      return l.text('Try our Batch API', { context: 'Call to try the batch processing API' })
    case 'documentAi':
      return l.text('Try Document AI', { context: 'Call to try document OCR in Studio' })
    case 'vibe':
      return l.text('Open Vibe', { context: 'Call to open Vibe' })
    case 'vibeCode':
      return l.text('Try Vibe Code', { context: 'Call to try Vibe Code, the coding mode of Vibe' })
    case 'admin':
      return l.text('Go to Admin', { context: 'Call to open the admin console' })
    case 'studio':
    default:
      return l.text('Try Studio', { context: 'Call to open the Studio console' })
  }
}

export const DynamicStudioCta = (props: React.ComponentProps<typeof Button>) => {
  const pathname = usePathname()
  const { href, key } = resolveCta(pathname)
  const label = useCtaLabel(key)

  return (
    <Button asChild {...props}>
      <Link href={`${href}${UTM}`} target="_blank" rel="noopener">
        {label} <ArrowRightIcon className="size-5" />
      </Link>
    </Button>
  );
};
