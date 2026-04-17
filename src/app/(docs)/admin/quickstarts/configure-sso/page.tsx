import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Configure SSO',
};

export default function Page() {
  redirect('/getting-started/quickstarts/admin/configure-sso');
}
