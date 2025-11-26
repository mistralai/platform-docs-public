import React from 'react';
import {
  ChatIcon,
  ComputerIcon,
  CutIcon,
  MusicIcon,
} from '@/components/icons/pixel';
import { EndpointIcon } from '@/schema/models';

// Model avatar icon mapping to actual SVG files from public/assets/models
export const AVATAR_ICONS = {
  'mistral-small': '/assets/models/Mistral_Small_3.1.svg',
  'mistral-medium': '/assets/models/Mistral_Medium_3.svg',
  moderation: '/assets/models/Moderation.svg',
  'mistral-7b': '/assets/models/Mistral_7B.svg',
  'mistral-large': '/assets/models/Mistral_Large_2.svg',
  'mistral-nemo': '/assets/models/Mistral_Nemo.svg',
  codestral: '/assets/models/Codestral.svg',
  devstral: '/assets/models/Devstral.svg',
  pixtral: '/assets/models/Pixtral.svg',
  ministral: '/assets/models/Ministral.svg',
  'mistral-embed': '/assets/models/Mistral_Embed.svg',
  magistral: '/assets/models/Magistral.svg',
  'codestral-mamba': '/assets/models/Codestral_Mamba.svg',
  ocr: '/assets/models/OCR.svg',
  voxtral: '/assets/models/Voxtral.svg',
  'mistral-saba': '/assets/models/Mistral_SABA.svg',
  'codestral-embed': '/assets/models/Codestral_Embed.svg',
  mathstral: '/assets/models/Mathstral.svg',
} as const;

export type AvatarIconVariant = keyof typeof AVATAR_ICONS;

export const getModelIconFallback = (modelName: string): AvatarIconVariant => {
  // Fallback icon scheme based on model name
  if (modelName.includes('Codestral')) return 'codestral';
  if (modelName.includes('Devstral')) return 'devstral';
  if (modelName.includes('Voxtral')) return 'mistral-nemo';
  if (modelName.includes('Magistral')) return 'mistral-large';
  if (modelName.includes('Pixtral')) return 'pixtral';
  if (modelName.includes('Ministral')) return 'ministral';
  if (modelName.includes('Small')) return 'mistral-small';
  if (modelName.includes('Medium')) return 'mistral-medium';
  if (modelName.includes('7B')) return 'mistral-7b';
  return 'mistral-7b';
};

// General icon resolver for different icon types
export const resolveIcon = (iconType: EndpointIcon): React.ElementType => {
  switch (iconType) {
    case EndpointIcon.CHAT:
      return ChatIcon;
    case EndpointIcon.CUT:
      return CutIcon;
    case EndpointIcon.MUSIC:
      return MusicIcon;
    case EndpointIcon.COMPUTER:
    default:
      return ComputerIcon;
  }
};
