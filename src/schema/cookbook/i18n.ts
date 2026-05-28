import type { Lingo } from '@lingo.dev/react';

/**
 * Localize a cookbook use-case label. Use-case strings come from cookbook data
 * (not a fixed enum), so unknown values pass through as-is.
 */
export function cookbookUseCaseLabel(useCase: string, l: Lingo): string {
  switch (useCase) {
    case 'Agents':
      return l.text('Agents', { context: 'Topic label for AI agents' });
    case 'OCR':
      return l.text('OCR', { context: 'Topic label for optical character recognition' });
    case 'Finetuning':
      return l.text('Finetuning', { context: 'Topic label for model fine-tuning' });
    case 'Evaluation':
      return l.text('Evaluation', { context: 'Topic label for model evaluation and benchmarking' });
    case 'Function calling':
      return l.text('Function calling', { context: 'Topic label for model tool calling' });
    case 'Structured outputs':
      return l.text('Structured outputs', { context: 'Topic label for schema-constrained model output' });
    case 'Multimodal':
      return l.text('Multimodal', { context: 'Topic label for text, image, or audio model input and output' });
    case 'Prefix':
      return l.text('Prefix', { context: 'Topic label for prefix-based generation' });
    case 'Batch':
      return l.text('Batch', { context: 'Topic label for batch API processing' });
    default:
      return useCase;
  }
}
