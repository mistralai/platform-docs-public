import { Metadata } from 'next';
import ChatPage from './endpoint/chat/page.mdx';

export const metadata: Metadata = {
  title: 'API Reference',
  description: 'Complete API reference for Mistral AI platform',
  openGraph: {
    title: 'API Reference',
    description: 'Complete API reference for Mistral AI platform',
    images: [
      {
        url: '/api/og?type=generic&title=API Reference&description=Complete API reference for Mistral AI platform',
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'API Reference',
    description: 'Complete API reference for Mistral AI platform',
    images: [
      '/api/og?type=generic&title=API Reference&description=Complete API reference for Mistral AI platform',
    ],
  },
};

export default function ApiPage() {
  return <ChatPage />;
}
