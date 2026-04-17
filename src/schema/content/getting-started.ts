/**
 * Official product logos from the Mistral brand system.
 * These are the canonical image paths for each product.
 */
export const PRODUCT_LOGOS = {
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
 * Sub-brand ownable colors from Mistral brand book.
 * Le Chat = red/crimson, Studio = blue, Docs = navy, Mistral/API = orange (parent brand).
 * Admin uses the parent brand orange since it's not a standalone sub-brand.
 */
export const PRODUCT_COLORS = {
  'le-chat': { bg: 'bg-[#C4001D]/10', text: 'text-[#C4001D]', border: 'border-[#C4001D]/20', hex: '#C4001D' },
  'studio': { bg: 'bg-[#2563EB]/10', text: 'text-[#2563EB]', border: 'border-[#2563EB]/20', hex: '#2563EB' },
  'api': { bg: 'bg-[#FF8205]/10', text: 'text-[#FF8205]', border: 'border-[#FF8205]/20', hex: '#FF8205' },
  'developer': { bg: 'bg-[#FF8205]/10', text: 'text-[#FF8205]', border: 'border-[#FF8205]/20', hex: '#FF8205' },
  'admin': { bg: 'bg-[#FF8205]/10', text: 'text-[#FF8205]', border: 'border-[#FF8205]/20', hex: '#FF8205' },
  'mistral-vibe': { bg: 'bg-[#7C3AED]/10', text: 'text-[#7C3AED]', border: 'border-[#7C3AED]/20', hex: '#7C3AED' },
  'models': { bg: 'bg-[#7C3AED]/10', text: 'text-[#7C3AED]', border: 'border-[#7C3AED]/20', hex: '#7C3AED' },
} as const;

export const QUICKSTART_CARDS = [
  {
    title: 'Le Chat',
    description: '',
    logo: PRODUCT_LOGOS['le-chat'],
    href: '/getting-started/quickstarts/le-chat',
    color: PRODUCT_COLORS['le-chat'],
  },
  {
    title: 'Studio',
    description: '',
    logo: PRODUCT_LOGOS['studio'],
    href: '/studio-api/overview',
    color: PRODUCT_COLORS['studio'],
  },
] as const;

