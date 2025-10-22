import { Metadata } from 'next';
import ChatPage from './endpoint/chat/page.mdx';

export const metadata: Metadata = {
  title: 'API Specs',
  description: 'Complete Mistral AI API Specifications',
  openGraph: {
    title: 'API Specs',
    description: 'Complete Mistral AI API Specifications',
    images: [
      {
        url: '/api/og?type=generic&eyebrow=API Specs&title=API Specs&description=Complete Mistral AI API Specifications',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'API Specs',
    description: 'Complete Mistral AI API Specifications',
    images: [
      '/api/og?type=generic&eyebrow=API Specs&title=API Specs&description=Complete Mistral AI API Specifications',
    ],
  },
};

export default function ApiPage() {
  return <ChatPage />;
}
