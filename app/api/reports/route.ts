import { NextRequest, NextResponse } from 'next/server';

import { getRoleFromToken } from '@/lib/auth';
import { queryReports } from '@/lib/reports';
import { ReportQueryParams } from '@/types';

export async function GET(request: NextRequest) {
  // Auth check
  const token =
    request.cookies.get('auth-token')?.value ||
    request.headers.get('x-auth-token');
  const role = getRoleFromToken(token ?? null);

  if (!role) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;

  const params: ReportQueryParams = {
    search: searchParams.get('search') ?? '',
    sort: searchParams.get('sort') ?? 'createdAt',
    order: (searchParams.get('order') as 'asc' | 'desc') ?? 'desc',
  };

  // Non-admin/analyst roles cannot see drafts
  if (role === 'viewer') {
    params.status = 'published';
  }

  const result = queryReports(params);

  return NextResponse.json(result);
}
