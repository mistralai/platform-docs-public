const cspDirectives = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-eval'",
    "'unsafe-inline'",
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://analytics.google.com',
    'https://client.axept.io',
    'https://api.axept.io',
    'https://static.axept.io',
    'https://cdn.jsdelivr.net',
    'https://vercel.live',
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'",
    'https://www.googletagmanager.com',
    'https://fonts.googleapis.com',
  ],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'img-src': [
    "'self'",
    'data:',
    'blob:',
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
    'https://analytics.google.com',
    'https://axeptio.imgix.net',
  ],
  'media-src': ["'self'", 'blob:'],
  'connect-src': [
    "'self'",
    'https://www.google-analytics.com',
    'https://region1.google-analytics.com',
    'https://analytics.google.com',
    'https://www.googletagmanager.com',
    'https://client.axept.io',
    'https://static.axept.io',
    'https://api.axept.io',
    'https://esm.sh',
  ],
  'frame-src': [
    "'self'",
    'https://www.youtube.com',
    'https://www.youtube-nocookie.com',
    'https://player.vimeo.com',
    'https://vercel.live/'
  ],
  'worker-src': ["'self'", 'blob:'],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
} as const;

export const cspHeader = Object.entries(cspDirectives)
  .map(([key, values]) =>
    values.length > 0 ? `${key} ${values.join(' ')}` : key
  )
  .join('; ');

// For use in next.config.ts headers
export const getCspHeaderValue = () => cspHeader;
