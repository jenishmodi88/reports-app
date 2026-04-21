import { Report, ReportQueryParams, ReportsResponse } from '../types';

import { MOCK_REPORTS } from './mockData';

export function queryReports(params: ReportQueryParams): ReportsResponse {
  const {
    search = '',
    sort = 'createdAt',
    order = 'desc',
  } = params;

  let filtered = [...MOCK_REPORTS];

  // Search
  if (search) {
    const query = search.toLowerCase();
    filtered = filtered.filter(
      (report) =>
        report.title.toLowerCase().includes(query) ||
        report.author.toLowerCase().includes(query) ||
        report.tags.some((t) => t.toLowerCase().includes(query)) ||
        report.summary.toLowerCase().includes(query)
    );
  }


  // Sort
  filtered.sort((a, b) => {
    let aVal: string | number = a[sort as keyof Report] as string | number;
    let bVal: string | number = b[sort as keyof Report] as string | number;

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });

  return { data: filtered };
}

export function getReportById(id: string): Report | undefined {
  return MOCK_REPORTS.find((report) => report.id === id);
}
