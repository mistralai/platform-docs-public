import { BASE_URL, DEPLOYMENT_SHA, OG_IMAGE_DIMENSIONS } from '@/lib/constants';
import { OGProps } from '.';

export const getOGImageUrl = ({
  path,
  title,
  titleFontSize,
  description,
  eyebraw,
  image,
  imageBackground,
  version = DEPLOYMENT_SHA,
}: {
  path: 'generic' | 'model';
  eyebraw: string;
  title: string;
  titleFontSize?: number;
  description: string;
  image: string;
  imageBackground?: string;
  version?: string;
}) => {
  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set('title', title);
  ogSearchParams.set('description', description);
  ogSearchParams.set('eyebraw', eyebraw);
  ogSearchParams.set('image', image);
  ogSearchParams.set('type', path || 'generic');
  if (titleFontSize) {
    ogSearchParams.set('titleFontSize', titleFontSize.toString());
  }
  if (version) {
    ogSearchParams.set('v', version);
  }
  if (imageBackground) {
    ogSearchParams.set('bg', imageBackground);
  }

  return `${BASE_URL}/api/og?${ogSearchParams.toString()}`;
};

export const getOGPropsFromSearchParams = (
  searchParams: URLSearchParams,
  defaults: OGProps
) => {
  return {
    imageBackground: searchParams.get('bg') ?? defaults.imageBackground,
    title: searchParams.get('title') ?? defaults.title,
    titleFontSize: searchParams.get('titleFontSize')
      ? Number(searchParams.get('titleFontSize'))
      : defaults.titleFontSize,
    description: searchParams.get('description') ?? defaults.description,
    eyebraw: searchParams.get('eyebraw') ?? defaults.eyebraw,
    image: searchParams.get('image') ?? defaults.image,
  };
};

export const getOGDeps = async () => {
  const sfMonoRegular = await fetch(
    `${BASE_URL}/fonts/sf-mono-regular.ttf`
  ).then(res => res.arrayBuffer());
  const arial = await fetch(`${BASE_URL}/fonts/arial.ttf`).then(res =>
    res.arrayBuffer()
  );
  const arialBold = await fetch(`${BASE_URL}/fonts/arial-bold.ttf`).then(res =>
    res.arrayBuffer()
  );

  return {
    width: OG_IMAGE_DIMENSIONS.width,
    height: OG_IMAGE_DIMENSIONS.height,
    fonts: [
      {
        name: 'SF Mono',
        data: sfMonoRegular,
        style: 'normal' as const,
        weight: 400 as const,
      },
      {
        name: 'Arial',
        data: arial,
        style: 'normal' as const,
        weight: 400 as const,
      },
      {
        name: 'Arial',
        data: arialBold,
        style: 'normal' as const,
        weight: 700 as const,
      },
    ],
  };
};
