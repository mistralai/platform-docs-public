import { Doc } from '@/schema/doc';

export const getIndex = (_locale: string) => {
  return [
    {
      id: 'changelog',
      url: '/resources/changelogs',
      title: 'Changelog',
      description: 'Our latest updates',
      body: '',
      type: 'docs',
    } satisfies Doc,
  ];
};
