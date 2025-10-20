export function getHeadingText(node: any): string {
  let text = '';

  if (node.type === 'text') {
    text += node.value || '';
  } else if (node.type === 'inlineCode') {
    text += node.value || '';
  } else if (node.type === 'strong' || node.type === 'emphasis') {
    text += (node.children || []).map((c: any) => c.value || '').join('');
  } else if (Array.isArray(node.children)) {
    for (const child of node.children) {
      text += getHeadingText(child);
    }
  }

  return text.trim();
}

export function slugify(str: string): string {
  if (!str) return 'heading';

  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Matches TOC's regex: remove non-word, non-space, non-hyphen
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove multiple hyphens (added for consistency with potential duplicates)
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

export function uniqueHeadingId(input: string, usedIds: Set<string>): string {
  const baseId = slugify(input) || 'heading';
  let finalId = baseId;
  let counter = 0;
  while (usedIds.has(finalId)) {
    counter++;
    finalId = `${baseId}-${counter}`;
  }
  usedIds.add(finalId);
  return finalId;
}
