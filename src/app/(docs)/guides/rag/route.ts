import { redirect } from 'next/navigation';

export async function GET() {
  redirect('/capabilities/embeddings/rag_quickstart');
}