import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getModelColorFallback, MODEL_COLORS } from '@/lib/colors';
import { getModelIconFallback, AVATAR_ICONS } from '@/lib/icons';
import * as React from 'react';
import { getOGDeps, getOGPropsFromSearchParams } from '@/components/og/helpers';
import { OG } from '@/components/og';
import { BASE_URL } from '@/lib/constants';

export const runtime = 'edge';

const getHexColor = (cssVar: string): string => {
  const colorMap: Record<string, string> = {
    'var(--model-pink)': '#E8A5C8',
    'var(--model-red)': '#E67E22',
    'var(--model-orange)': '#F39C12',
    'var(--model-yellow)': '#F1C40F',
    'var(--model-green)': '#2ECC71',
    'var(--badge-released)': '#A4E661',
    'var(--model-blue)': '#3498DB',
    'var(--model-purple)': '#9B59B6',
    'var(--model-beige)': '#F5F5DC',
    'var(--model-gray)': '#BDC3C7',
  };
  return colorMap[cssVar] || '#BDC3C7';
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'generic';

    let OGProps;

    if (type === 'model') {
      const title = searchParams.get('title') || 'Model';
      const description =
        searchParams.get('description') || 'Mistral AI Language Model';
      const version = searchParams.get('version') || '0.1';

      const modelIcon = getModelIconFallback(title);
      const modelColor = getModelColorFallback(title);
      const cssColorVar = MODEL_COLORS[modelColor];
      const backgroundColor = getHexColor(cssColorVar);

      const iconPath = AVATAR_ICONS[modelIcon as keyof typeof AVATAR_ICONS];
      const modelSvgUrl = iconPath ? `${BASE_URL}${iconPath}` : null;

      const modelSvg = modelSvgUrl ? (
        <img
          src={modelSvgUrl}
          style={{ height: '60%', width: '60%', objectFit: 'contain' }}
          alt={title}
        />
      ) : (
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="30" fill="#BDC3C7" />
        </svg>
      );

      OGProps = getOGPropsFromSearchParams(searchParams, {
        title,
        description,
        eyebraw: version,
        imageBackground: backgroundColor,
        image: '',
      });

      return new ImageResponse(
        <OG {...OGProps} image={modelSvg} />,
        await getOGDeps()
      );
    } else {
      OGProps = getOGPropsFromSearchParams(searchParams, {
        title: 'Generic',
        description: 'Generic Description',
        eyebraw: 'Mistral AI',
        image: '/ogs/docs.png',
      });

      const response = new ImageResponse(
        <OG {...OGProps} />,
        await getOGDeps()
      );

      if (searchParams.get('v') !== 'dev') {
        response.headers.set(
          'Cache-Control',
          'public, max-age=31536000, immutable'
        );
      }

      return response;
    }
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
