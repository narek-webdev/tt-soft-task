'use client';

import { useState, useEffect, useCallback } from 'react';
import { QuizSession, Answer } from '../types';
import { getStoredSession, setStoredSession, clearStoredSession } from '../utils/storage';

export function useQuizSession() {
  const [session, setSession] = useState<QuizSession | null>(null);

  useEffect(() => {
    const stored = getStoredSession();
    if (stored) setSession(stored);
  }, []);

  const persist = useCallback((updated: QuizSession) => {
    setSession(updated);
    setStoredSession(updated);
  }, []);

  const startQuiz = useCallback((quizId: string) => {
    const newSession: QuizSession = {
      quizId,
      currentStep: 0,
      answers: [],
    };
    persist(newSession);
  }, [persist]);

  const goToStep = useCallback((step: number) => {
    setSession(prev => {
      if (!prev) return prev;
      const updated = { ...prev, currentStep: step };
      setStoredSession(updated);
      return updated;
    });
  }, []);

  const answerQuestion = useCallback((answer: Answer) => {
    setSession(prev => {
      if (!prev) return prev;
      const existingIndex = prev.answers.findIndex(a => a.questionId === answer.questionId);
      let newAnswers: Answer[];
      if (existingIndex >= 0) {
        newAnswers = [...prev.answers];
        newAnswers[existingIndex] = answer;
      } else {
        newAnswers = [...prev.answers, answer];
      }
      const updated = { ...prev, answers: newAnswers };
      setStoredSession(updated);
      return updated;
    });
  }, []);

  const resetSession = useCallback(() => {
    setSession(null);
    clearStoredSession();
  }, []);

  return {
    session,
    startQuiz,
    goToStep,
    answerQuestion,
    resetSession,
  };
}
