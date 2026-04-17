import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Manage workspaces',
};

export default function Page() {
  redirect('/getting-started/quickstarts/admin/manage-workspaces');
}
