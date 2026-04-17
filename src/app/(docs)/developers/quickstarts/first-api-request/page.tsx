import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Send your first API request',
};

export default function Page() {
  redirect('/getting-started/quickstarts/developer/first-api-request');
}
