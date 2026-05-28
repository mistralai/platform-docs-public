import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Mistral AI',
  description: "Documentation for the deployment and usage of Mistral AI's LLMs",
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicons/favicon.ico' },
      { url: '/favicons/favicon-16x16.png', sizes: '16x16' },
      { url: '/favicons/favicon-32x32.png', sizes: '32x32' },
    ],
    apple: '/favicons/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
