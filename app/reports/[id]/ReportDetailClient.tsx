'use client';

import Link from 'next/link';

import Navbar from '@/components/Navbar';
import AISummaryPanel from '@/components/AISummaryPanel';
import { Report, UserRole } from '@/types';

import styles from './reportDetail.module.scss';

interface Props {
  report: Report;
  userName: string;
  userRole: UserRole;
}

const CATEGORY_COLORS: Record<string, string> = {
  Finance: '#34d399',
  Operations: '#4f8ef7',
  Marketing: '#f59e0b',
  HR: '#a78bfa',
  Technical: '#38bdf8',
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  published: { label: 'Published', color: '#34d399' },
  draft: { label: 'Draft', color: '#f59e0b' },
  archived: { label: 'Archived', color: '#8892a4' },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatNumber(n: number) {
  return n.toLocaleString();
}

export default function ReportDetailClient({ report, userName, userRole }: Props) {
  const catColor = CATEGORY_COLORS[report.category] ?? '#8892a4';
  const status = STATUS_CONFIG[report.status];

  return (
    <div className={styles.root}>
      <Navbar userName={userName} userRole={userRole} />

      <div className={styles.pageWrap}>
        <div className={styles.breadcrumb}>
          <Link href="/reports" className={styles.breadcrumbLink}>
            ← Reports
          </Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbCurrent}>{report.title}</span>
        </div>

        <div className={styles.layout}>
          <main className={styles.main}>
            {/* Header */}
            <header className={styles.header}>
              <div className={styles.headerMeta}>
                <span
                  className={styles.category}
                  style={{ color: catColor, borderColor: `${catColor}33`, background: `${catColor}11` }}
                >
                  {report.category}
                </span>
                <span
                  className={styles.status}
                  style={{ color: status.color, borderColor: `${status.color}33`, background: `${status.color}11` }}
                >
                  {status.label}
                </span>
              </div>

              <h1 className={styles.title}>{report.title}</h1>
              <p className={styles.summary}>{report.summary}</p>

              <div className={styles.metaRow}>
                <div className={styles.author}>
                  <div
                    className={styles.avatar}
                    style={{ background: catColor }}
                  >
                    {report.author.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <div className={styles.authorName}>{report.author}</div>
                    <div className={styles.authorLabel}>Author</div>
                  </div>
                </div>

                <div className={styles.dates}>
                  <div className={styles.dateItem}>
                    <span className={styles.dateLabel}>Created</span>
                    <span className={styles.dateValue}>{formatDate(report.createdAt)}</span>
                  </div>
                  <div className={styles.dateItem}>
                    <span className={styles.dateLabel}>Updated</span>
                    <span className={styles.dateValue}>{formatDate(report.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Content */}
            <div className={styles.contentSection}>
              <h2 className={styles.contentTitle}>Report Content</h2>
              <div className={styles.accentLine} style={{ background: catColor }} />
              <p className={styles.content}>{report.content}</p>
            </div>

            {/* Tags */}
            <div className={styles.tagsSection}>
              <span className={styles.tagsLabel}>Tags</span>
              <div className={styles.tags}>
                {report.tags.map((tag) => (
                  <span key={tag} className={styles.tag}>#{tag}</span>
                ))}
              </div>
            </div>
          </main>

          <aside className={styles.sidebar}>
            {/* Metrics */}
            <div className={styles.metricsCard}>
              <h3 className={styles.metricsTitle}>Engagement</h3>
              <div className={styles.metricsGrid}>
                <div className={styles.metricItem}>
                  <div className={styles.metricValue}>{formatNumber(report.metrics.views)}</div>
                  <div className={styles.metricLabel}>Views</div>
                </div>
                <div className={styles.metricItem}>
                  <div className={styles.metricValue}>{formatNumber(report.metrics.downloads)}</div>
                  <div className={styles.metricLabel}>Downloads</div>
                </div>
              </div>
            </div>

            {/* AI Summary */}
            <AISummaryPanel reportId={report.id} />
          </aside>
        </div>
      </div>
    </div>
  );
}
