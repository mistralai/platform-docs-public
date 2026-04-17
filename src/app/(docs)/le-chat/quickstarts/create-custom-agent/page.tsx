import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Create a custom agent',
};

export default function Page() {
  redirect('/getting-started/quickstarts/le-chat/create-custom-agent');
}
