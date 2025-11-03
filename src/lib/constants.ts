const DEFAULT_URL = 'http://localhost:3000';

const VERCEL_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : undefined;

const CLOUDFLARE_URL = process.env.CF_PAGES_URL
  ? `https://${process.env.CF_PAGES_URL}`
  : undefined;

const VERCEL_ORIGIN_URL = new URL(
  process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
).origin;

export const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  VERCEL_URL ||
  CLOUDFLARE_URL ||
  DEFAULT_URL;

export const DEPLOYMENT_SHA = process.env.VERCEL_GIT_COMMIT_SHA || 'dev';

export const DEPLOYMENT_ENV = process.env.VERCEL_ENV || 'development';

export const OG_IMAGE_DIMENSIONS = { width: 1200, height: 630 };

// --------------------
// MISTRAL URLS
// --------------------

export const MISTRAL_URL = process.env.MISTRAL_URL
  ? new URL(process.env.MISTRAL_URL)
  : new URL('https://mistral.ai');

export const MISTRAL_CHAT_URL = process.env.MISTRAL_CHAT_URL
  ? new URL(process.env.MISTRAL_CHAT_URL)
  : new URL('https://chat.mistral.ai/chat');

export const MISTRAL_STUDIO_URL = process.env.MISTRAL_STUDIO_URL
  ? new URL(process.env.MISTRAL_STUDIO_URL)
  : new URL('https://console.mistral.ai/home');

export const MISTRAL_BRAND_GUIDELINES_URL = process.env
  .MISTRAL_BRAND_GUIDELINES_URL
  ? new URL(process.env.MISTRAL_BRAND_GUIDELINES_URL)
  : new URL('https://mistral.ai/brand');

export const MISTRAL_API_REFERENCE_URL = process.env.MISTRAL_API_REFERENCE_URL
  ? new URL(process.env.MISTRAL_API_REFERENCE_URL)
  : new URL('https://docs.mistral.ai/api');

export const MISTRAL_CONSOLE_URL = process.env.MISTRAL_CONSOLE_URL
  ? new URL(process.env.MISTRAL_CONSOLE_URL)
  : new URL('https://console.mistral.ai');
export const MISTRAL_HELP_CENTER_URL = process.env.MISTRAL_HELP_CENTER_URL
  ? new URL(process.env.MISTRAL_HELP_CENTER_URL)
  : new URL('https://help.mistral.ai');

export const MISTRAL_PRICING_URL = new URL('/pricing', MISTRAL_URL);
const _MISTRAL_API_PRICING_URL = new URL('', MISTRAL_PRICING_URL);
_MISTRAL_API_PRICING_URL.hash = 'api-pricing';
export const MISTRAL_API_PRICING_URL = _MISTRAL_API_PRICING_URL.toString();
export const MISTRAL_CONTACT_URL = new URL('/contact', MISTRAL_URL);
