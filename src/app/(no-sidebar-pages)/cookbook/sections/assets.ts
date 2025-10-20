export type CardData = {
  id: number;
  title: string;
  color: string;
  models: { src: string; alt: string }[];
  gridPattern?: number[];
};

export const modelAssets = [
  { src: '/assets/models/Mistral_Small_3.1.svg', alt: 'Mistral Small 3.1' },
  { src: '/assets/models/Devstral.svg', alt: 'Devstral' },
  { src: '/assets/models/Mistral_Medium_3.svg', alt: 'Mistral Medium 3' },
  { src: '/assets/models/Mistral_Large_2.svg', alt: 'Mistral Large 2' },
];
