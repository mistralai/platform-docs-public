import 'server-only';
import { cache } from 'react';
import { createLingo } from '@lingo.dev/react';
import { loadMessages } from './messages';
import type { Locale } from './config';

export { loadMessages };

export const getLingo = cache(async (locale: Locale | string) => {
  return createLingo(locale, loadMessages(locale));
});
