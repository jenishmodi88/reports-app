import { NextRequest, NextResponse } from 'next/server';

import { getRoleFromToken } from '@/lib/auth';
import { getReportById } from '@/lib/reports';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token =
    request.cookies.get('auth-token')?.value ||
    request.headers.get('x-auth-token');
  const role = getRoleFromToken(token ?? null);

  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const report = getReportById(id);

  if (!report) {
    return NextResponse.json({ error: 'Report not found' }, { status: 404 });
  }

  // Viewers cannot access drafts
  if (report.status === 'draft' && role === 'viewer') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json(report);
}
