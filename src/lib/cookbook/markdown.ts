export function normalizeStr(v: string | string[] | undefined | null): string {
  if (!v) return '';
  return Array.isArray(v) ? v.join('') : v;
}

function looksLikeXmlSvg(s: string) {
  const trimmed = s.trim().slice(0, 200).toLowerCase();
  return trimmed.includes('<svg');
}

function buildDataUrl(mime: string, raw: string): string {
  if (raw.startsWith('data:')) return raw;
  if (mime === 'image/svg+xml' && looksLikeXmlSvg(raw)) {
    return `data:${mime};utf8,${encodeURIComponent(raw)}`;
  }
  return `data:${mime};base64,${raw}`;
}

export function firstImageDataUrl(
  bundle: Record<string, any>,
  preferred: string[] = [
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/gif',
    'image/svg+xml',
  ]
): { src: string; mime: string } | null {
  for (const mime of preferred) {
    if (bundle && bundle[mime] != null) {
      const raw = normalizeStr(bundle[mime]);
      if (!raw) continue;
      return { src: buildDataUrl(mime, raw), mime };
    }
  }
  return null;
}

export function resolveMarkdownAttachments(
  markdown: string,
  attachments: any
): string {
  if (!attachments) return markdown;

  return markdown.replace(
    /!\[[^\]]*\]\(attachment:([^)]+)\)/g,
    (_m, rawName) => {
      const candidateNames = [rawName];
      try {
        candidateNames.push(decodeURIComponent(rawName));
      } catch {}

      let chosenKey: string | null = null;

      for (const name of candidateNames) {
        if (attachments[name]) {
          chosenKey = name;
          break;
        }
      }

      if (!chosenKey) {
        const keys = Object.keys(attachments);
        if (keys.length === 1) {
          chosenKey = keys[0];
        } else {
          const ext = (rawName.split('.').pop() || '').toLowerCase();
          const byExt = keys.find(
            k => (k.split('.').pop() || '').toLowerCase() === ext
          );
          chosenKey = byExt ?? keys[0];
        }
      }

      const att = chosenKey ? attachments[chosenKey] : null;
      if (!att) return _m;

      const selectedUrl = firstImageDataUrl(att, [
        'image/png',
        'image/jpeg',
        'image/webp',
        'image/gif',
        'image/svg+xml',
      ]);
      if (!selectedUrl) return _m;
      return `![${rawName}](${selectedUrl.src})`;
    }
  );
}
