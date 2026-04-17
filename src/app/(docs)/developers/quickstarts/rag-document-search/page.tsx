import { redirect } from 'next/navigation';

export const metadata = {
  title: 'RAG with document search',
};

export default function Page() {
  redirect('/getting-started/quickstarts/developer/rag-document-search');
}
