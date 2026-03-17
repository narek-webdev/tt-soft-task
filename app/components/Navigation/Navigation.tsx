'use client';

import styles from './Navigation.module.css';

interface NavigationProps {
  activeTab: 'dashboard' | 'quiz';
  onTabChange: (tab: 'dashboard' | 'quiz') => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className={styles.nav}>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'dashboard' ? styles.active : ''}`}
          onClick={() => onTabChange('dashboard')}
        >
          Admin Dashboard
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'quiz' ? styles.active : ''}`}
          onClick={() => onTabChange('quiz')}
        >
          Quiz
        </button>
      </div>
    </nav>
  );
}
