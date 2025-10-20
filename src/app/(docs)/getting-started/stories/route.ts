import { redirect } from 'next/navigation';

export async function GET() {
  redirect('/getting-started/customization#developer-examples');
}