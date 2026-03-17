'use client';

import { Choice } from '../../../types';
import styles from './ChoiceGrid.module.css';

interface ChoiceGridProps {
  choices: Choice[];
  selectedIds: string[];
  multiSelect: boolean;
  onSelect: (choiceId: string) => void;
  customText?: string;
  onCustomTextChange?: (text: string) => void;
}

export default function ChoiceGrid({
  choices,
  selectedIds,
  multiSelect,
  onSelect,
  customText,
  onCustomTextChange,
}: ChoiceGridProps) {
  return (
    <div>
      <div className={styles.grid}>
        {choices.map(choice => (
          <button
            key={choice.id}
            className={`${styles.choice} ${selectedIds.includes(choice.id) ? styles.selected : ''}`}
            onClick={() => onSelect(choice.id)}
          >
            {choice.label || 'Untitled'}
          </button>
        ))}
        {multiSelect && onCustomTextChange && (
          <div className={styles.addYours}>
            <input
              className={styles.addYoursInput}
              type="text"
              placeholder="Add yours..."
              value={customText || ''}
              onChange={e => onCustomTextChange(e.target.value)}
            />
          </div>
        )}
      </div>
      {multiSelect && (
        <div className={styles.hint}>Select all that apply</div>
      )}
    </div>
  );
}
