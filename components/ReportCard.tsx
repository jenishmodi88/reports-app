'use client';

import Link from 'next/link';
import { Report } from '../types';
import styles from './ReportCard.module.scss';

interface ReportCardProps {
  report: Report;
}

const CATEGORY_COLORS: Record<string, string> = {
  Finance: '#34d399',
  Operations: '#4f8ef7',
  Marketing: '#f59e0b',
  HR: '#a78bfa',
  Technical: '#38bdf8',
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  published: { label: 'Published', color: '#34d399' },
  draft: { label: 'Draft', color: '#f59e0b' },
  archived: { label: 'Archived', color: '#8892a4' },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatNumber(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export default function ReportCard({ report }: ReportCardProps) {
  const catColor = CATEGORY_COLORS[report.category] ?? '#8892a4';
  const status = STATUS_LABELS[report.status];

  return (
    <Link href={`/reports/${report.id}`} className={styles.card} style={{ '--cat-color': catColor } as React.CSSProperties}>
      <div className={styles.cardInner}>
        <div className={styles.topRow}>
          <span className={styles.category}>{report.category}</span>
          <span
            className={styles.status}
            style={{ color: status.color, borderColor: `${status.color}33`, background: `${status.color}11` }}
          >
            {status.label}
          </span>
        </div>

        <h3 className={styles.title}>{report.title}</h3>
        <p className={styles.summary}>{report.summary}</p>

        <div className={styles.tags}>
          {report.tags.slice(0, 3).map((tag) => (
            <span key={tag} className={styles.tag}>#{tag}</span>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.author}>
            <div className={styles.avatar}>
              {report.author.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>{report.author}</span>
              <span className={styles.date}>{formatDate(report.updatedAt)}</span>
            </div>
          </div>

          <div className={styles.metrics}>
            <span className={styles.metric}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              {formatNumber(report.metrics.views)}
            </span>
            <span className={styles.metric}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              {formatNumber(report.metrics.downloads)}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.accentBar} />
    </Link>
  );
}
