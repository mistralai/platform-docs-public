import localFont from 'next/font/local';

export const sfMono = localFont({
  src: [
    {
      path: '../../public/fonts/sf-mono-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/sf-mono-regularitalic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../../public/fonts/sf-mono-medium.woff2',
      weight: '500',
      style: 'medium',
    },
    {
      path: '../../public/fonts/sf-mono-mediumitalic.woff2',
      weight: '500',
      style: 'italic',
    },
    {
      path: '../../public/fonts/sf-mono-semibold.woff2',
      weight: '600',
      style: 'semibold',
    },
    {
      path: '../../public/fonts/sf-mono-semibolditalic.woff2',
      weight: '600',
      style: 'italic',
    },
  ],
  display: 'swap',
  variable: '--font-sf-mono',
});
