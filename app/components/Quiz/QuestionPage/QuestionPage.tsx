'use client';

import { useState, useEffect } from 'react';
import { Question, Answer } from '../../../types';
import StepIndicator from '../StepIndicator/StepIndicator';
import TextInput from '../TextInput/TextInput';
import ChoiceGrid from '../ChoiceGrid/ChoiceGrid';
import styles from './QuestionPage.module.css';

interface QuestionPageProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  existingAnswer?: Answer;
  onAnswer: (answer: Answer) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function QuestionPage({
  question,
  questionNumber,
  totalQuestions,
  existingAnswer,
  onAnswer,
  onNext,
  onBack,
  isFirst,
  isLast,
}: QuestionPageProps) {
  const [selectedChoiceIds, setSelectedChoiceIds] = useState<string[]>(
    existingAnswer?.selectedChoiceIds || []
  );
  const [textValue, setTextValue] = useState(existingAnswer?.textValue || '');
  const [customText, setCustomText] = useState('');

  // Reset state when question changes
  useEffect(() => {
    setSelectedChoiceIds(existingAnswer?.selectedChoiceIds || []);
    setTextValue(existingAnswer?.textValue || '');
    setCustomText('');
  }, [question.id, existingAnswer]);

  const saveAnswer = () => {
    onAnswer({
      questionId: question.id,
      selectedChoiceIds,
      textValue,
    });
  };

  const handleNext = () => {
    saveAnswer();
    onNext();
  };

  const handleBack = () => {
    saveAnswer();
    onBack();
  };

  const handleChoiceSelect = (choiceId: string) => {
    if (question.type === 'radio') {
      setSelectedChoiceIds([choiceId]);
    } else {
      setSelectedChoiceIds(prev =>
        prev.includes(choiceId)
          ? prev.filter(id => id !== choiceId)
          : [...prev, choiceId]
      );
    }
  };

  return (
    <div className={styles.card}>
      <StepIndicator current={questionNumber} total={totalQuestions} />

      <div className={styles.content}>
        <h2 className={styles.title}>{question.title || 'Untitled Question'}</h2>
        {question.description && (
          <p className={styles.description}>{question.description}</p>
        )}

        {question.type === 'text' ? (
          <TextInput value={textValue} onChange={setTextValue} />
        ) : (
          <ChoiceGrid
            choices={question.choices}
            selectedIds={selectedChoiceIds}
            multiSelect={question.type === 'checkbox'}
            onSelect={handleChoiceSelect}
            customText={customText}
            onCustomTextChange={question.type === 'checkbox' ? setCustomText : undefined}
          />
        )}
      </div>

      <div className={styles.nav}>
        <button
          className={`${styles.navBtn} ${isFirst ? styles.hidden : ''}`}
          onClick={handleBack}
          disabled={isFirst}
        >
          ← BACK
        </button>
        <button className={styles.navBtn} onClick={handleNext}>
          {isLast ? 'FINISH' : 'NEXT'} →
        </button>
      </div>
    </div>
  );
}
