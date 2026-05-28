import type { Lingo } from '@lingo.dev/react';
import type { HeaderDropdownId, HeaderLinkId } from './header';

export function headerLinkLabel(id: HeaderLinkId, l: Lingo): string {
  switch (id) {
    case 'getting-started':
      return l.text('Getting Started', { context: 'Top navigation label for getting-started docs' });
    case 'models':
      return l.text('Models', { context: 'Top navigation label for AI models' });
    case 'products':
      return l.text('Products', { context: 'Top navigation label for Mistral products' });
    case 'developers':
      return l.text('Developers', { context: 'Top navigation label for developer docs and resources' });
    case 'admin':
      return l.text('Admin', { context: 'Top navigation label for admin docs' });
    case 'api':
      return l.text('API', { context: 'Top navigation label for the API reference' });
  }
}

export function headerDropdownLabel(id: HeaderDropdownId, l: Lingo): string {
  switch (id) {
    case 'vibe':
      return l.text('Vibe', { context: "Product name for Mistral's unified agent" });
    case 'ai-studio':
      return l.text('Studio', { context: 'Product name for Mistral\'s developer platform' });
    case 'docs-api':
      return l.text('Docs & API', { context: 'Navigation label for documentation and API' });
    case 'admin':
      return l.text('Admin', { context: 'Navigation label for the admin console' });
  }
}
