import { StaticModel } from '../schema';
export default {
  name: 'OCR 2',
  description: `Our OCR service powering our Document AI stack that enables our users to extract interleaved text and images`,
  shortDescription: `Our OCR service powering our Document AI stack.`,
  slug: 'ocr-2-25-05',
  releaseDate: 'May 22, 2025',
  version: '25.05',
  frontier: false,
  class: 'Specialist',
  type: 'Premier',
  legalButton: 'https://legal.mistral.ai/ai-governance/models/mistral-ocr',
  status: 'Deprecated',
  avatar: { icon: 'ocr', backgroundColor: 'red' },
  weights: [],
  bloglink: 'https://mistral.ai/solutions/document-ai',
  paperlink: null,
  contextLength: null,
  ratings: { 
    speed: { stars: 4.0, label: 'Fast' },
    performance: { stars: 3.0, label: 'Smart' }, input: { stars: 4.0, label: 'Fast' }, output: { stars: 2.0, label: 'Moderate' } },
  pricing: {
    type: 'custom',
    free: false,
    input: [
      { type: 'flat', price: 1.0, denominator: '/1000 Pages' },
      { type: 'flat', price: 3.0, denominator: '/1000 Annotated Pages' }
    ],
    output: [
      
    ]
  },
  identifiers: { apiNames: ['mistral-ocr-2505'] },
  capabilities: {
    input: ['image', 'document'],
    output: ['text', 'image'],
    features: ['bbox-extraction', 'ocr', 'annotations-structured-ocr', 'batching'],
    finetuning: [],
  },
  metadata: {deprecationDate: 'February 27, 2026', retirementDate: 'May 31, 2026', replacement: 'OCR 3'},
  playground: '',
  legacy: true,
} as const satisfies StaticModel;
