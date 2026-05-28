import fs from 'node:fs';
import path from 'node:path';
import type { Messages } from '@lingo.dev/react';
import { getActiveEntries, readLocaleFile } from '@lingo.dev/spec';

const MESSAGES_DIR = path.join(process.cwd(), 'src/i18n/messages');

export function loadMessages(locale: string): Messages {
  const filePath = path.join(MESSAGES_DIR, `${locale}.jsonc`);
  if (!fs.existsSync(filePath)) return {};
  const { entries } = readLocaleFile(fs.readFileSync(filePath, 'utf8'));
  return Object.fromEntries(getActiveEntries(entries).map((e) => [e.key, e.value]));
}
