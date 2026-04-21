'use client';

import { useState } from 'react';
import { AISummary } from '../types';
import styles from './AISummaryPanel.module.scss';

interface AISummaryPanelProps {
  reportId: string;
}

const SENTIMENT_CONFIG = {
  positive: { icon: '↑', label: 'Positive', color: '#34d399' },
  neutral: { icon: '→', label: 'Neutral', color: '#f59e0b' },
  negative: { icon: '↓', label: 'Negative', color: '#f87171' },
};

export default function AISummaryPanel({ reportId }: AISummaryPanelProps) {
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    setSummary(null);

    try {
      const res = await fetch('/api/ai-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to generate summary');
      }

      const data: AISummary = await res.json();
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.aiIcon}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <circle cx="12" cy="17" r=".5" fill="currentColor"/>
            </svg>
          </div>
          <div>
            <h3 className={styles.title}>AI Analysis</h3>
            <p className={styles.subtitle}>Powered by Claude</p>
          </div>
        </div>

        {!summary && !loading && (
          <button className={styles.generateBtn} onClick={generate}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Generate
          </button>
        )}

        {summary && (
          <button className={styles.regenerateBtn} onClick={generate}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            Regenerate
          </button>
        )}
      </div>

      {!summary && !loading && !error && (
        <div className={styles.idle}>
          <div className={styles.idleIcon}>⚡</div>
          <p>Generate an AI-powered analysis of this report including key points, sentiment, and a concise summary.</p>
        </div>
      )}

      {loading && (
        <div className={styles.loading}>
          <div className={styles.loadingDots}>
            <span />
            <span />
            <span />
          </div>
          <p className={styles.loadingText}>Analyzing report content…</p>
        </div>
      )}

      {error && (
        <div className={styles.error}>
          <span className={styles.errorIcon}>⚠</span>
          <div>
            <p className={styles.errorTitle}>Generation failed</p>
            <p className={styles.errorMessage}>{error}</p>
          </div>
          <button className={styles.retryBtn} onClick={generate}>
            Retry
          </button>
        </div>
      )}

      {summary && (
        <div className={styles.result}>
          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Sentiment</span>
              <span
                className={styles.metaValue}
                style={{ color: SENTIMENT_CONFIG[summary.sentiment].color }}
              >
                {SENTIMENT_CONFIG[summary.sentiment].icon}{' '}
                {SENTIMENT_CONFIG[summary.sentiment].label}
              </span>
            </div>
            <div className={styles.metaDivider} />
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Read time</span>
              <span className={styles.metaValue}>{summary.readingTime} min</span>
            </div>
          </div>

          <p className={styles.summaryText}>{summary.summary}</p>

          <div className={styles.keyPoints}>
            <h4 className={styles.keyPointsTitle}>Key Points</h4>
            <ul className={styles.keyPointsList}>
              {summary.keyPoints.map((point, i) => (
                <li key={i} className={styles.keyPoint}>
                  <span className={styles.keyPointDot} />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
