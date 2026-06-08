/**
 * Official product logos from the Mistral brand system.
 * These are the canonical image paths for each product.
 *
 * Vibe is the canonical brand post-rebrand. The 'le-chat' and 'mistral-vibe'
 * keys are kept for back-compat with older imports and asset paths only.
 */
export const PRODUCT_LOGOS = {
  'vibe': '/assets/logos/vibe.svg',
  'vibe-work': '/assets/logos/vibe.svg',
  'vibe-code': '/assets/logos/vibe-code.svg',
  'le-chat': '/assets/logos/le-chat.svg',
  'studio': '/assets/logos/studio.svg',
  'mistral-vibe': '/assets/logos/mistral-vibe.png',
  'admin': '/assets/logos/admin.svg',
  'developer': '/assets/logos/developer.svg',
} as const;

/**
 * Section header logos (pixel-art characters) for the getting-started page.
 */
export const SECTION_LOGOS = {
  'products': '/assets/logos/products.svg',
  'developer': '/assets/logos/developer.svg',
  'admin': '/assets/logos/admin.svg',
} as const;

/**
 * Sub-brand ownable colors from the new Mistral brand kit.
 * Vibe + Vibe Code share #FA500F (orange, parent brand);
 * Studio uses #0082E6 (blue);
 * Docs uses #6F6F84 (grey);
 * Admin / Developer stay on parent orange.
 * Legacy keys (le-chat, mistral-vibe, models, api) kept for back-compat.
 */
export const PRODUCT_COLORS = {
  'vibe': { bg: 'bg-[#FA500F]/10', text: 'text-[#FA500F]', border: 'border-[#FA500F]/20', hex: '#FA500F' },
  'vibe-work': { bg: 'bg-[#FA500F]/10', text: 'text-[#FA500F]', border: 'border-[#FA500F]/20', hex: '#FA500F' },
  'vibe-code': { bg: 'bg-[#FA500F]/10', text: 'text-[#FA500F]', border: 'border-[#FA500F]/20', hex: '#FA500F' },
  'studio': { bg: 'bg-[#0082E6]/10', text: 'text-[#0082E6]', border: 'border-[#0082E6]/20', hex: '#0082E6' },
  'docs': { bg: 'bg-[#6F6F84]/10', text: 'text-[#6F6F84]', border: 'border-[#6F6F84]/20', hex: '#6F6F84' },
  'developer': { bg: 'bg-[#0082E6]/10', text: 'text-[#0082E6]', border: 'border-[#0082E6]/20', hex: '#0082E6' },
  'admin': { bg: 'bg-[#4a4a5e]/10', text: 'text-[#4a4a5e]', border: 'border-[#4a4a5e]/20', hex: '#4a4a5e' },
  'le-chat': { bg: 'bg-[#C4001D]/10', text: 'text-[#C4001D]', border: 'border-[#C4001D]/20', hex: '#C4001D' },
  'mistral-vibe': { bg: 'bg-[#7C3AED]/10', text: 'text-[#7C3AED]', border: 'border-[#7C3AED]/20', hex: '#7C3AED' },
  'api': { bg: 'bg-[#0082E6]/10', text: 'text-[#0082E6]', border: 'border-[#0082E6]/20', hex: '#0082E6' },
  'models': { bg: 'bg-[#7C3AED]/10', text: 'text-[#7C3AED]', border: 'border-[#7C3AED]/20', hex: '#7C3AED' },
} as const;

export const QUICKSTART_CARDS = [
  {
    title: 'Vibe Work',
    description: '',
    logo: PRODUCT_LOGOS['vibe-work'],
    href: '/getting-started/quickstarts/vibe-work',
    color: PRODUCT_COLORS['vibe-work'],
  },
  {
    title: 'Vibe Code',
    description: '',
    logo: PRODUCT_LOGOS['vibe-code'],
    href: '/getting-started/quickstarts/vibe-code',
    color: PRODUCT_COLORS['vibe-code'],
  },
  {
    title: 'Studio',
    description: '',
    logo: PRODUCT_LOGOS['studio'],
    href: '/studio-api/overview',
    color: PRODUCT_COLORS['studio'],
  },
] as const;

