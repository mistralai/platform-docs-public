import { DisplayTypeInfo } from '@/app/(api)/types/shared';

export function computeSingleLineDisplayType(typeInfo: DisplayTypeInfo): {
  measure: string;
  display: string;
} {
  switch (typeInfo.label) {
    case 'array':
    case 'map':
    case 'event-stream':
    case 'jsonl':
    case 'set': {
      const children = typeInfo.children.map(computeSingleLineDisplayType);
      return {
        measure: `${typeInfo.label}<${children.map(c => c.measure).join(',')}>`,
        display: `${typeInfo.label}&lt;${children.map(c => c.display).join(',')}&gt;`,
      };
    }
    case 'union':
    case 'enum': {
      const children = typeInfo.children.map(computeSingleLineDisplayType);
      return {
        measure: children.map(c => c.measure).join(' | '),
        display: children.map(c => c.display).join(' | '),
      };
    }
    default: {
      return {
        measure: typeInfo.label,
        display: typeInfo.linkedLabel || typeInfo.label,
      };
    }
  }
}

type MultilineTypeLabelEntry = {
  contents: string;
  multiline: boolean;
};

export function computeMultilineTypeLabel(
  typeInfo: DisplayTypeInfo,
  indentation: number,
  maxCharacters: number
): MultilineTypeLabelEntry {
  switch (typeInfo.label) {
    case 'array':
    case 'map':
    case 'event-stream':
    case 'jsonl':
    case 'set': {
      // First, check if we can show this on a single line
      const singleLineContents = computeSingleLineDisplayType(typeInfo);
      if (singleLineContents.measure.length < maxCharacters - indentation) {
        return {
          contents: singleLineContents.display,
          multiline: false,
        };
      }

      // If we got here, we know this will be multiline, so compute each child
      // separately. We'll stitch them together later.
      const children: MultilineTypeLabelEntry[] = [];
      for (const child of typeInfo.children) {
        children.push(
          computeMultilineTypeLabel(child, indentation + 2, maxCharacters)
        );
      }

      let contents = `${typeInfo.label}&lt;<br />`;
      for (const child of children) {
        contents += `${'&nbsp;'.repeat(indentation + 2)}${child.contents}<br />`;
      }
      contents += `${'&nbsp;'.repeat(indentation)}&gt;`;
      return {
        contents,
        multiline: true,
      };
    }
    case 'union':
    case 'enum': {
      // First, check if we can show this on a single line
      const singleLineContents = computeSingleLineDisplayType(typeInfo);
      if (singleLineContents.measure.length < maxCharacters - indentation) {
        return {
          contents: singleLineContents.display,
          multiline: false,
        };
      }

      // If we got here, we know this will be multiline, so compute each child
      // separately. We'll stitch them together later.
      const children: MultilineTypeLabelEntry[] = [];
      for (const child of typeInfo.children) {
        children.push(computeMultilineTypeLabel(child, 0, maxCharacters));
      }

      let contents = '';
      for (let i = 0; i < children.length; i++) {
        const child = children[i];

        // If this is the first child, then we've already applied padding from
        // the parent before getting here.
        const prefix = i > 0 ? '&nbsp;'.repeat(indentation) : '';

        // If this is the last child, then we don't need a trailing newline
        // since it will be appended by the parent
        const suffix = i < children.length - 1 ? '<br />' : '';

        // Will never be undefined given how the loop/array is constructed
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        contents += `${prefix}| ${child!.contents}${suffix}`;
      }
      return {
        contents,
        multiline: true,
      };
    }
    default: {
      return {
        contents: typeInfo.linkedLabel || typeInfo.label,
        multiline: false,
      };
    }
  }
}
