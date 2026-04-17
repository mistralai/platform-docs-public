import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Draft a research report',
};

export default function Page() {
  redirect('/getting-started/quickstarts/le-chat/draft-research-report');
}
