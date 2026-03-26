"use client"
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRightIcon } from '@/components/icons/pixel';

const UTM = "?utm_source=docs&utm_medium=header_cta&utm_campaign=studio_trial"
const DEFAULT_CTA = { href: "https://console.mistral.ai", label: "Try Studio" } as const

const CTA_BY_PATH: Record<string, { href: string; label: string }> = {
  "/capabilities/audio": {
    href: "https://console.mistral.ai/build/audio/speech-to-text",
    label: "Try our Audio API",
  },
  "/capabilities/audio/speech_to_text/offline_transcription": {
    href: "https://console.mistral.ai/build/audio/speech-to-text",
    label: "Try our Audio API",
  },
  "/capabilities/audio/speech_to_text/realtime_transcription": {
    href: "https://console.mistral.ai/build/audio/realtime",
    label: "Try our Realtime Audio API",
  },
  "/capabilities/finetuning": {
    href: "https://console.mistral.ai/build/finetuned-models",
    label: "Try our Fine-tuning",
  },
  "/capabilities/batch": {
    href: "https://console.mistral.ai/build/batches",
    label: "Try our Batch API",
  },
  "/getting-started/models": {
    href: "https://console.mistral.ai/build/playground",
    label: "Visit the Playground",
  },
  "/getting-started/models/compare": {
    href: "https://console.mistral.ai/build/playground",
    label: "Visit the Playground",
  },
  "/capabilities/document_ai": {
    href: "https://console.mistral.ai/build/document-ai/ocr-playground",
    label: "Try Document AI",
  },
  "/capabilities/code_generation": {
    href: "https://console.mistral.ai/codestral/cli",
    label: "Try Mistral Vibe",
  },
  "/mistral-vibe/introduction": {
    href: "https://console.mistral.ai/codestral/cli",
    label: "Try Mistral Vibe",
  },
  "/mistral-vibe/agents-skills": {
    href: "https://console.mistral.ai/codestral/cli",
    label: "Try Mistral Vibe",
  },
  "/mistral-vibe/local": {
    href: "https://console.mistral.ai/codestral/cli",
    label: "Try Mistral Vibe",
  },
}

export const DynamicStudioCta = (props: React.ComponentProps<typeof Button>) => {
  const pathname = usePathname()
  const { href, label } = CTA_BY_PATH[pathname] ?? DEFAULT_CTA

  return (
    <Button asChild {...props}>
      <Link href={`${href}${UTM}`} target="_blank" rel="noopener">
        {label} <ArrowRightIcon className="size-5" />
      </Link>
    </Button>
  );
};
