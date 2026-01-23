export enum EndpointIcon {
  CHAT = 'chat',
  EMBEDDING = 'embedding',
  CALCULATOR = 'calculator',
  AUDIO = 'audio',
  COMPUTER = 'computer'
}

export const AVAILABLE_ENDPOINTS = {
  'chat-completions': {
    name: 'Chat / Completions',
    path: '/v1/chat/completions',
    type: 'chat' as const,
    icon: EndpointIcon.CHAT,
    href: '#',
  },
  'fim-completions': {
    name: 'Fim / Completions',
    path: '/v1/fim/completions',
    type: 'fim' as const,
    icon: EndpointIcon.COMPUTER,
    href: '#',
  },
  moderations: {
    name: 'Moderations',
    path: '/v1/moderations',
    type: 'moderation' as const,
    icon: EndpointIcon.CALCULATOR,
    href: '#',
  },
  'chat-moderations': {
    name: 'Chat / Moderations',
    path: '/v1/chat/moderations',
    type: 'moderation' as const,
    icon: EndpointIcon.CALCULATOR,
    href: '#',
  },
  ocr: {
    name: 'OCR',
    path: '/v1/ocr',
    type: 'ocr' as const,
    icon: EndpointIcon.COMPUTER,
    href: '#',
  },
  agents: {
    name: 'Agents',
    path: '/v1/agents',
    type: 'chat' as const,
    icon: EndpointIcon.CHAT,
    href: '#',
  },
  conversations: {
    name: 'Conversations',
    path: '/v1/conversations',
    type: 'chat' as const,
    icon: EndpointIcon.CHAT,
    href: '#',
  },
  batch: {
    name: 'Batch',
    path: '/v1/batch',
    type: 'batch' as const,
    icon: EndpointIcon.COMPUTER,
    href: '#',
  },
  embeddings: {
    name: 'Embeddings',
    path: '/v1/embeddings',
    type: 'embeddings' as const,
    icon: EndpointIcon.EMBEDDING,
    href: '#',
  },
  'audio-transcriptions': {
    name: 'Audio Transcriptions',
    path: '/v1/audio/transcriptions',
    type: 'transcription' as const,
    icon: EndpointIcon.AUDIO,
    href: '#',
  },
} as const;

export type EndpointKey = keyof typeof AVAILABLE_ENDPOINTS;
