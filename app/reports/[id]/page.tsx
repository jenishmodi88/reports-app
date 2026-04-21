import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';

import { getUserFromToken } from '@/lib/auth';
import { getReportById } from '@/lib/reports';

import ReportDetailClient from './ReportDetailClient';

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value ?? null;
  const user = getUserFromToken(token);

  if (!user) {
    redirect('/?reason=unauthenticated&redirect=/reports');
  }

  const { id } = await params;
  const report = getReportById(id);

  if (!report) {
    notFound();
  }

  // Viewers cannot see drafts
  if (report.status === 'draft' && user.role === 'viewer') {
    redirect('/reports');
  }

  return (
    <ReportDetailClient
      report={report}
      userName={user.name}
      userRole={user.role}
    />
  );
}
