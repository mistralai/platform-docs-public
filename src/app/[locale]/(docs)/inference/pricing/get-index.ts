import { Doc } from '@/schema/doc';

export const getIndex = (_locale: string) => {
  return [
    {
      id: 'pricing',
      url: '/inference/pricing',
      title: 'Pricing',
      description: 'Pricing',
      body: '',
      type: 'docs',
    } satisfies Doc,
  ];
};
