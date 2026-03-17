'use client';

import styles from './WelcomePage.module.css';

interface WelcomePageProps {
  title: string;
  description: string;
  onStart: () => void;
}

export default function WelcomePage({ title, description, onStart }: WelcomePageProps) {
  return (
    <div className={styles.card}>
      <h1 className={styles.title}>{title}</h1>
      {description && <p className={styles.description}>{description}</p>}
      <button className={styles.startBtn} onClick={onStart}>
        Take Our Quiz
      </button>
    </div>
  );
}
