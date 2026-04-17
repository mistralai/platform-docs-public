import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Analyze data',
};

export default function Page() {
  redirect('/getting-started/quickstarts/le-chat/analyze-data');
}
