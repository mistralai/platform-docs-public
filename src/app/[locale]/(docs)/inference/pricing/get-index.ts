import { Doc } from '@/schema/doc';

export const getIndex = (_locale: string) => {
  return [
    {
      id: 'pricing',
      url: '/inference/pricing',
      title: 'API pricing',
      description: 'Pricing for Mistral models through the API, organized by family.',
      body: '',
      type: 'docs',
    } satisfies Doc,
  ];
};
