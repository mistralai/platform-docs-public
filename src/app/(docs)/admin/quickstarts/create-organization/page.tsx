import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Create your organization',
};

export default function Page() {
  redirect('/getting-started/quickstarts/admin/create-organization');
}
