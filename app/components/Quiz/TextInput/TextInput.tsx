'use client';

import styles from './TextInput.module.css';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TextInput({ value, onChange }: TextInputProps) {
  return (
    <input
      className={styles.input}
      type="text"
      placeholder="Type here..."
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
}
