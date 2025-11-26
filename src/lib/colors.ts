export const MODEL_COLORS = {
  pink: 'var(--model-pink)',
  pinkSubtle: 'var(--model-pink-subtle)',
  red: 'var(--model-red)',
  redSubtle: 'var(--model-red-subtle)',
  orange: 'var(--model-orange)',
  orangeSubtle: 'var(--model-orange-subtle)',
  yellow: 'var(--model-yellow)',
  yellowSubtle: 'var(--model-yellow-subtle)',
  green: 'var(--model-green)',
  greenSubtle: 'var(--model-green-subtle)',
  lime: 'var(--badge-released)',
  limeSubtle: 'var(--model-lime-subtle)',
  teal: 'var(--model-teal)',
  tealSubtle: 'var(--model-teal-subtle)',
  blue: 'var(--model-blue)',
  blueSubtle: 'var(--model-blue-subtle)',
  purple: 'var(--model-purple)',
  purpleSubtle: 'var(--model-purple-subtle)',
  sky: 'var(--model-sky)',
  skySubtle: 'var(--model-sky-subtle)',
  cyan: 'var(--model-cyan)',
  cyanSubtle: 'var(--model-cyan-subtle)',
  rose: 'var(--model-rose)',
  roseSubtle: 'var(--model-rose-subtle)',
  indigo: 'var(--model-indigo)',
  indigoSubtle: 'var(--model-indigo-subtle)',
  fuschia: 'var(--model-fuschia)',
  fuschiaSubtle: 'var(--model-fuschia-subtle)',
  violet: 'var(--model-violet)',
  violetSubtle: 'var(--model-violet-subtle)',
  amber: 'var(--model-amber)',
  amberSubtle: 'var(--model-amber-subtle)',
  emerald: 'var(--model-emerald)',
  emeraldSubtle: 'var(--model-emerald-subtle)',
  beigeSubtle: 'var(--model-beige-subtle)',
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
