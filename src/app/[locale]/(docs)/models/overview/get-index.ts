import { Doc } from '@/schema/doc';

export const getIndex = (_locale: string) => {
  return [
    {
      id: 'models',
      url: '/models/overview',
      title: 'Models',
      description: 'Models',
      body: '',
      type: 'docs',
    } satisfies Doc,
  ];
};
