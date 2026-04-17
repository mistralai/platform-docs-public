"use client"
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRightIcon } from '@/components/icons/pixel';

const UTM = "?utm_source=docs&utm_medium=header_cta&utm_campaign=studio_trial"
const DEFAULT_CTA = { href: "https://console.mistral.ai", label: "Try Studio" } as const

const CTA_BY_PATH: Record<string, { href: string; label: string }> = {

  "/studio-api/audio/speech_to_text/offline_transcription": {
    href: "https://console.mistral.ai/build/audio/speech-to-text",
    label: "Try our Audio API",
  },
  "/studio-api/audio/speech_to_text/realtime_transcription": {
    href: "https://console.mistral.ai/build/audio/realtime",
    label: "Try our Realtime Audio API",
  },
  "/studio-api/batch-processing": {
    href: "https://console.mistral.ai/build/batches",
    label: "Try our Batch API",
  },
  "/models/overview": {
    href: "https://console.mistral.ai/build/playground",
    label: "Try Studio",
  },
  "/models/model-selection-guide": {
    href: "https://console.mistral.ai/build/playground",
    label: "Try Studio",
  },
  "/studio-api/document-processing": {
    href: "https://console.mistral.ai/build/document-ai/ocr-playground",
    label: "Try Document AI",
  },
  "/mistral-vibe/using-fim-api": {
    href: "https://console.mistral.ai/codestral/cli",
    label: "Try Vibe",
  },
  "/mistral-vibe/terminal": {
    href: "https://console.mistral.ai/codestral/cli",
    label: "Try Vibe",
  },
  "/mistral-vibe/agents-skills": {
    href: "https://console.mistral.ai/codestral/cli",
    label: "Try Vibe",
  },
  "/mistral-vibe/local": {
    href: "https://console.mistral.ai/codestral/cli",
    label: "Try Vibe",
  },
}

const CTA_BY_PREFIX: Array<{ prefix: string; href: string; label: string }> = [
  { prefix: "/le-chat", href: "https://chat.mistral.ai", label: "Try Le Chat" },
  { prefix: "/mistral-vibe", href: "https://console.mistral.ai/codestral/cli", label: "Try Vibe" },
  { prefix: "/admin", href: "https://console.mistral.ai/organisation", label: "Go to Admin" },
]

function resolveCta(pathname: string) {
  const exact = CTA_BY_PATH[pathname]
  if (exact) return exact
  const prefixMatch = CTA_BY_PREFIX.find(({ prefix }) => pathname === prefix || pathname.startsWith(prefix + "/"))
  if (prefixMatch) return prefixMatch
  return DEFAULT_CTA
}

export const DynamicStudioCta = (props: React.ComponentProps<typeof Button>) => {
  const pathname = usePathname()
  const { href, label } = resolveCta(pathname)

  return (
    <Button asChild {...props}>
      <Link href={`${href}${UTM}`} target="_blank" rel="noopener">
        {label} <ArrowRightIcon className="size-5" />
      </Link>
    </Button>
  );
};
