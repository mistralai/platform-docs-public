// Featured cookbook paths and topics for the main page
// These are manually curated selections showcasing diverse capabilities

/**
 * Featured cookbook paths - manually ordered for display
 *
 * IMPORTANT: The order of items in this array determines the display order.
 * - First item becomes the hero/primary cookbook (large card)
 * - Second item becomes the secondary cookbook
 * - Remaining items are displayed as tertiary cookbooks
 *
 * To reorder: Simply move items up or down in this array
 * Total: 5 cookbooks covering various use cases and integrations
 */
export const FEATURED_COOKBOOK_PATHS = [
  // Primary featured (hero cookbook)
  'mistral/ocr/document_understanding.ipynb',

  // Core AI capabilities
  'mistral/classifier_factory/product_classification.ipynb',
  'mistral/ocr/data_extraction.ipynb',
  'mistral/agents/non_framework/hubspot_dynamic_multi_agent/hubspot_dynamic_multi_agent_system.ipynb',
  'mistral/fine_tune/pixtral_finetune_on_satellite_data.ipynb',
];

/**
 * Featured use case topics - manually ordered for display
 *
 * IMPORTANT: The order of items in this array determines the display order
 * in the topics section. To reorder: Simply move items up or down in this array.
 *
 * Showcases the most important and popular use cases
 */
export const FEATURED_USE_CASES = [
  'Agents',
  'OCR',
  'Finetuning',
  'Evaluation',
  'Function calling',
  'Structured outputs',
  'Multimodal',
  'Prefix',
  'Batch'
] as const;

/**
 * Featured integration topics - manually ordered for display
 *
 * IMPORTANT: The order of items in this array determines the display order
 * in the topics section. To reorder: Simply move items up or down in this array.
 *
 * Highlights key integrations and platforms
 */
export const FEATURED_INTEGRATIONS = [] as const;

// Type exports for type safety
export type FeaturedUseCase = (typeof FEATURED_USE_CASES)[number];
export type FeaturedIntegration = (typeof FEATURED_INTEGRATIONS)[number];
