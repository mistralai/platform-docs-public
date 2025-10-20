import { redirect } from 'next/navigation';

export async function GET() {
  redirect('/capabilities/completion/prompting_capabilities/');
}