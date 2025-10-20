import { redirect } from 'next/navigation';

export async function GET() {
  redirect('/capabilities/completion/sampling');
}