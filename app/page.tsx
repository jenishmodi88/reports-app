'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import styles from './page.module.scss';

const DEMO_ROLES = [
  {
    token: 'admin-token',
    role: 'Admin',
    name: 'Admin User',
    description: 'Full access — can view drafts, archived reports, and manage settings.',
    color: '#a78bfa',
    icon: '⬡',
  },
  {
    token: 'analyst-token',
    role: 'Analyst',
    name: 'Jane Analyst',
    description: 'Can view all reports including drafts and download data.',
    color: '#4f8ef7',
    icon: '◈',
  },
  {
    token: 'viewer-token',
    role: 'Viewer',
    name: 'Bob Viewer',
    description: 'Read-only access to published reports only.',
    color: '#34d399',
    icon: '◉',
  },
];

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/reports';
  const reason = searchParams.get('reason');

  const [loading, setLoading] = useState<string | null>(null);

  const handleLogin = (token: string) => {
    setLoading(token);
    document.cookie = `auth-token=${token}; path=/; max-age=86400`;
    setTimeout(() => router.push(redirect), 300);
  };

  return (
    <main className={styles.main}>
      <div className={styles.bg}>
        <div className={styles.bgOrb1} />
        <div className={styles.bgOrb2} />
        <div className={styles.bgGrid} />
      </div>

      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.logoMark}>
            <span>RL</span>
          </div>
          <h1 className={styles.title}>ReportLens</h1>
          <p className={styles.tagline}>
            Intelligent report management, powered by AI insights
          </p>
        </header>

        {reason === 'unauthenticated' && (
          <div className={styles.notice}>
            <span>🔒</span> Authentication required. Select a role to continue.
          </div>
        )}

        <div className={styles.roleSection}>
          <p className={styles.roleLabel}>— Select a demo role to sign in —</p>
          <div className={styles.roleGrid}>
            {DEMO_ROLES.map((r) => (
              <button
                key={r.token}
                className={styles.roleCard}
                onClick={() => handleLogin(r.token)}
                disabled={loading !== null}
                style={{ '--role-color': r.color } as React.CSSProperties}
              >
                <div className={styles.roleIcon}>{r.icon}</div>
                <div className={styles.roleInfo}>
                  <span className={styles.roleName}>{r.role}</span>
                  <span className={styles.roleUser}>{r.name}</span>
                  <p className={styles.roleDesc}>{r.description}</p>
                </div>
                {loading === r.token && (
                  <div className={styles.roleLoading}>
                    <span className={styles.spinner} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <footer className={styles.footer}>
          <span>Built with Next.js App Router · TypeScript · SCSS Modules</span>
        </footer>
      </div>
    </main>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  );
}
