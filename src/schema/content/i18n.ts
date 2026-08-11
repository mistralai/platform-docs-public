import type { Lingo } from '@lingo.dev/react';
import type { HeaderDropdownId, HeaderLinkId } from './header';

export function headerLinkLabel(id: HeaderLinkId, l: Lingo, locale = 'en'): string {
  switch (id) {
    case 'vibe':
      return l.text('Vibe', { context: "Product name for Mistral's unified agent" });
    case 'studio':
      return l.text('Studio', { context: "Product name for Mistral's developer platform" });
    case 'inference':
      return l.text('Inference & Models', { context: 'Top navigation label for inference and models docs' });
    case 'admin':
      return l.text('Admin', { context: 'Top navigation label for admin docs' });
    case 'resources':
      return locale === 'fr' ? 'Ressources' : 'Resources';
    case 'api':
      return 'API Reference';
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
