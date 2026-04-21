'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './Navbar.module.scss';

interface NavbarProps {
  userName?: string;
  userRole?: string;
}

export default function Navbar({ userName, userRole }: NavbarProps) {
  const router = useRouter();

  const handleLogout = () => {
    document.cookie = 'auth-token=; path=/; max-age=0';
    router.push('/');
  };

  const roleColor = {
    admin: '#a78bfa',
    analyst: '#4f8ef7',
    viewer: '#34d399',
  }[userRole ?? ''] ?? '#8892a4';

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/reports" className={styles.brand}>
          <div className={styles.logo}>RL</div>
          <span className={styles.brandName}>ReportLens</span>
        </Link>

        <div className={styles.right}>
          {userName && (
            <div className={styles.user}>
              <div className={styles.userAvatar} style={{ background: roleColor }}>
                {userName.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{userName}</span>
                <span className={styles.userRole} style={{ color: roleColor }}>
                  {userRole}
                </span>
              </div>
            </div>
          )}
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
