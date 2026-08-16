// apps/marketing-site/app/_components/theme-toggle.tsx

'use client';

import { useEffect, useState } from 'react';
import styles from './theme-toggle.module.css';

const STORAGE_KEY = 'topiadesk-theme';

function applyTheme(isDark: boolean) {
  const root = document.documentElement;
  root.classList.toggle('dark', isDark);
  root.classList.toggle('light', !isDark);
}

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    applyTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next ? 'dark' : 'light');
  }

  // Avoid rendering a checkbox state that might not match the real theme
  // before the anti-flash script + this effect have had a chance to sync.
  if (!mounted) {
    return <div className={styles.switch} aria-hidden="true" />;
  }

  return (
    <label className={styles.switch} aria-label="Toggle dark mode">
      <input type="checkbox" checked={isDark} onChange={toggleTheme} />

      <div className={styles.slider}>
        <div className={styles.sunMoon}>
          <svg className={`${styles.moonDot} ${styles.moonDot1}`} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg className={`${styles.moonDot} ${styles.moonDot2}`} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg className={`${styles.moonDot} ${styles.moonDot3}`} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>

          <svg className={styles.lightRay1} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg className={styles.lightRay2} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg className={styles.lightRay3} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>

          <svg className={`${styles.cloudDark} ${styles.cloud1}`} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg className={`${styles.cloudDark} ${styles.cloud2}`} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg className={`${styles.cloudDark} ${styles.cloud3}`} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg className={`${styles.cloudLight} ${styles.cloud4}`} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg className={`${styles.cloudLight} ${styles.cloud5}`} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
          <svg className={`${styles.cloudLight} ${styles.cloud6}`} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" />
          </svg>
        </div>

        <div className={styles.stars}>
          <svg className={`${styles.star} ${styles.star1}`} viewBox="0 0 20 20">
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
          </svg>
          <svg className={`${styles.star} ${styles.star2}`} viewBox="0 0 20 20">
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
          </svg>
          <svg className={`${styles.star} ${styles.star3}`} viewBox="0 0 20 20">
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
          </svg>
          <svg className={`${styles.star} ${styles.star4}`} viewBox="0 0 20 20">
            <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z" />
          </svg>
        </div>
      </div>
    </label>
  );
}
