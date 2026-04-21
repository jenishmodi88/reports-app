import Link from 'next/link';
import styles from './unauthorized.module.scss';

export default function UnauthorizedPage() {
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.icon}>⛔</div>
        <h1 className={styles.title}>Access Denied</h1>
        <p className={styles.message}>
          You don&apos;t have permission to view this page. Contact your administrator to request access.
        </p>
        <Link href="/reports" className={styles.backBtn}>
          ← Back to Reports
        </Link>
      </div>
    </main>
  );
}
