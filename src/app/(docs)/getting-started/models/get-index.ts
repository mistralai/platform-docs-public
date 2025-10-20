import { Doc } from '@/schema/doc';

export const getIndex = () => {
  return [
    {
      id: 'models',
      url: '/models',
      title: 'Models',
      description: 'Models',
      body: '',
      type: 'docs',
    } satisfies Doc,
  ];
};
