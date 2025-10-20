export const MODEL_COLORS = {
  pink: 'var(--model-pink)',
  red: 'var(--model-red)',
  orange: 'var(--model-orange)',
  yellow: 'var(--model-yellow)',
  green: 'var(--model-green)',
  lime: 'var(--badge-released)',
  blue: 'var(--model-blue)',
  purple: 'var(--model-purple)',
  beige: 'var(--model-beige)',
  gray: 'var(--model-gray)',
};

export type ModelColor = keyof typeof MODEL_COLORS;

export const getModelColorFallback = (modelName: string): ModelColor => {
  // Fallback color scheme based on model name
  if (modelName.includes('Small')) return 'orange';
  if (modelName.includes('Medium')) return 'red';
  if (modelName.includes('Codestral')) return 'yellow';
  if (modelName.includes('Voxtral')) return 'purple';
  if (modelName.includes('Magistral')) return 'blue';
  if (modelName.includes('Pixtral')) return 'green';
  if (modelName.includes('Devstral')) return 'green';
  if (modelName.includes('Ministral')) return 'purple';
  return 'gray';
};
