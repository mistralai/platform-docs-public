import { redirect } from 'next/navigation';

export async function GET() {
  redirect('/capabilities/finetuning/');
}