'use client';

import styles from './StepIndicator.module.css';

interface StepIndicatorProps {
  current: number;
  total: number;
}

export default function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    <div className={styles.indicator}>
      Question {current} of {total}
    </div>
  );
}
