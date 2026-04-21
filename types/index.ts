export type ReportStatus = 'published' | 'draft' | 'archived';
export type ReportCategory = 'Finance' | 'Operations' | 'Marketing' | 'HR' | 'Technical';
export type UserRole = 'admin' | 'analyst' | 'viewer';

export interface Report {
  id: string;
  title: string;
  category: ReportCategory;
  status: ReportStatus;
  author: string;
  createdAt: string;
  updatedAt: string;
  summary: string;
  content: string;
  tags: string[];
  metrics: {
    views: number;
    downloads: number;
  };
}

export interface ReportsResponse {
  data: Report[];
}

export interface ReportQueryParams {
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
  status?: ReportStatus | '';
}

export interface AISummary {
  summary: string;
  keyPoints: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  readingTime: number;
}
