'use client';

import styles from './QuizForm.module.css';

interface QuizFormProps {
  title: string;
  description: string;
  onUpdateTitle: (title: string) => void;
  onUpdateDescription: (description: string) => void;
}

export default function QuizForm({ title, description, onUpdateTitle, onUpdateDescription }: QuizFormProps) {
  return (
    <div className={styles.form}>
      <label className={styles.label}>Quiz Title</label>
      <input
        className={styles.input}
        type="text"
        value={title}
        onChange={e => onUpdateTitle(e.target.value)}
        placeholder="Enter quiz title..."
      />
      <label className={styles.label}>Description</label>
      <textarea
        className={styles.textarea}
        value={description}
        onChange={e => onUpdateDescription(e.target.value)}
        placeholder="Enter quiz description..."
      />
    </div>
  );
}
