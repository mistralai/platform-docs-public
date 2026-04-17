import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Build an agent with tools',
};

export default function Page() {
  redirect('/getting-started/quickstarts/developer/build-an-agent');
}
