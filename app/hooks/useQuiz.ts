'use client';

import { useState, useEffect, useCallback } from 'react';
import { Quiz, Question, Choice, QuestionType } from '../types';
import { getStoredQuiz, setStoredQuiz } from '../utils/storage';

function generateId(): string {
  return crypto.randomUUID();
}

export function useQuiz() {
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    const stored = getStoredQuiz();
    if (stored) setQuiz(stored);
  }, []);

  const persist = useCallback((updated: Quiz) => {
    setQuiz(updated);
    setStoredQuiz(updated);
  }, []);

  const createQuiz = useCallback((title: string, description: string) => {
    const newQuiz: Quiz = {
      id: generateId(),
      title,
      description,
      questions: [],
    };
    persist(newQuiz);
  }, [persist]);

  const updateQuiz = useCallback((partial: Partial<Pick<Quiz, 'title' | 'description'>>) => {
    setQuiz(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...partial };
      setStoredQuiz(updated);
      return updated;
    });
  }, []);

  const addQuestion = useCallback((type: QuestionType) => {
    setQuiz(prev => {
      if (!prev) return prev;
      const newQuestion: Question = {
        id: generateId(),
        title: '',
        description: '',
        type,
        choices: type !== 'text' ? [
          { id: generateId(), label: '', attachedProductIds: [], order: 0 },
          { id: generateId(), label: '', attachedProductIds: [], order: 1 },
        ] : [],
        order: prev.questions.length,
      };
      const updated = { ...prev, questions: [...prev.questions, newQuestion] };
      setStoredQuiz(updated);
      return updated;
    });
  }, []);

  const updateQuestion = useCallback((questionId: string, partial: Partial<Pick<Question, 'title' | 'description' | 'type'>>) => {
    setQuiz(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        questions: prev.questions.map(q => {
          if (q.id !== questionId) return q;
          const updatedQ = { ...q, ...partial };
          // If type changed to text, clear choices. If changed from text, add default choices.
          if (partial.type && partial.type !== q.type) {
            if (partial.type === 'text') {
              updatedQ.choices = [];
            } else if (q.type === 'text') {
              updatedQ.choices = [
                { id: generateId(), label: '', attachedProductIds: [], order: 0 },
                { id: generateId(), label: '', attachedProductIds: [], order: 1 },
              ];
            }
          }
          return updatedQ;
        }),
      };
      setStoredQuiz(updated);
      return updated;
    });
  }, []);

  const removeQuestion = useCallback((questionId: string) => {
    setQuiz(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        questions: prev.questions
          .filter(q => q.id !== questionId)
          .map((q, i) => ({ ...q, order: i })),
      };
      setStoredQuiz(updated);
      return updated;
    });
  }, []);

  const reorderQuestions = useCallback((orderedIds: string[]) => {
    setQuiz(prev => {
      if (!prev) return prev;
      const questionMap = new Map(prev.questions.map(q => [q.id, q]));
      const reordered = orderedIds
        .map((id, i) => {
          const q = questionMap.get(id);
          return q ? { ...q, order: i } : null;
        })
        .filter((q): q is Question => q !== null);
      const updated = { ...prev, questions: reordered };
      setStoredQuiz(updated);
      return updated;
    });
  }, []);

  const addChoice = useCallback((questionId: string) => {
    setQuiz(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        questions: prev.questions.map(q => {
          if (q.id !== questionId) return q;
          const newChoice: Choice = {
            id: generateId(),
            label: '',
            attachedProductIds: [],
            order: q.choices.length,
          };
          return { ...q, choices: [...q.choices, newChoice] };
        }),
      };
      setStoredQuiz(updated);
      return updated;
    });
  }, []);

  const updateChoice = useCallback((questionId: string, choiceId: string, partial: Partial<Pick<Choice, 'label'>>) => {
    setQuiz(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        questions: prev.questions.map(q => {
          if (q.id !== questionId) return q;
          return {
            ...q,
            choices: q.choices.map(c =>
              c.id === choiceId ? { ...c, ...partial } : c
            ),
          };
        }),
      };
      setStoredQuiz(updated);
      return updated;
    });
  }, []);

  const removeChoice = useCallback((questionId: string, choiceId: string) => {
    setQuiz(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        questions: prev.questions.map(q => {
          if (q.id !== questionId) return q;
          return {
            ...q,
            choices: q.choices
              .filter(c => c.id !== choiceId)
              .map((c, i) => ({ ...c, order: i })),
          };
        }),
      };
      setStoredQuiz(updated);
      return updated;
    });
  }, []);

  const reorderChoices = useCallback((questionId: string, orderedIds: string[]) => {
    setQuiz(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        questions: prev.questions.map(q => {
          if (q.id !== questionId) return q;
          const choiceMap = new Map(q.choices.map(c => [c.id, c]));
          const reordered = orderedIds
            .map((id, i) => {
              const c = choiceMap.get(id);
              return c ? { ...c, order: i } : null;
            })
            .filter((c): c is Choice => c !== null);
          return { ...q, choices: reordered };
        }),
      };
      setStoredQuiz(updated);
      return updated;
    });
  }, []);

  const attachProducts = useCallback((questionId: string, choiceId: string, productIds: number[]) => {
    setQuiz(prev => {
      if (!prev) return prev;
      const updated = {
        ...prev,
        questions: prev.questions.map(q => {
          if (q.id !== questionId) return q;
          return {
            ...q,
            choices: q.choices.map(c =>
              c.id === choiceId ? { ...c, attachedProductIds: productIds } : c
            ),
          };
        }),
      };
      setStoredQuiz(updated);
      return updated;
    });
  }, []);

  const deleteQuiz = useCallback(() => {
    setQuiz(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('quiz_app_quiz');
    }
  }, []);

  return {
    quiz,
    createQuiz,
    updateQuiz,
    addQuestion,
    updateQuestion,
    removeQuestion,
    reorderQuestions,
    addChoice,
    updateChoice,
    removeChoice,
    reorderChoices,
    attachProducts,
    deleteQuiz,
  };
}
