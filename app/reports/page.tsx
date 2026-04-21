import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { getUserFromToken } from '@/lib/auth';

import ReportsClient from './ReportsClient';

export default async function ReportsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value ?? null;
  const user = getUserFromToken(token);

  if (!user) {
    redirect('/?reason=unauthenticated&redirect=/reports');
  }

  return <ReportsClient userName={user.name} userRole={user.role} />;
}
