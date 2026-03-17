'use client';

import { useEffect, useState } from 'react';
import { Quiz as QuizType } from '../../types';
import { getStoredQuiz } from '../../utils/storage';
import { useQuizSession } from '../../hooks/useQuizSession';
import WelcomePage from './WelcomePage/WelcomePage';
import QuestionPage from './QuestionPage/QuestionPage';
import ResultPage from './ResultPage/ResultPage';
import styles from './Quiz.module.css';

export default function Quiz() {
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const { session, startQuiz, goToStep, answerQuestion, resetSession } = useQuizSession();

  useEffect(() => {
    const stored = getStoredQuiz();
    setQuiz(stored);
  }, []);

  if (!quiz || quiz.questions.length === 0) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.noQuiz}>
          <h2>No Quiz Available</h2>
          <p>Create a quiz in the Dashboard first.</p>
        </div>
      </div>
    );
  }

  const totalQuestions = quiz.questions.length;
  const currentStep = session?.quizId === quiz.id ? session.currentStep : -1;

  const handleStart = () => {
    startQuiz(quiz.id);
    goToStep(1);
  };

  const handleRestart = () => {
    resetSession();
    startQuiz(quiz.id);
    goToStep(1);
  };

  // Welcome page
  if (currentStep <= 0) {
    return (
      <div className={styles.wrapper}>
        <WelcomePage
          title={quiz.title}
          description={quiz.description}
          onStart={handleStart}
        />
      </div>
    );
  }

  // Result page
  if (currentStep > totalQuestions) {
    return (
      <div className={styles.wrapper}>
        <ResultPage
          quiz={quiz}
          answers={session?.answers || []}
          onRestart={handleRestart}
        />
      </div>
    );
  }

  // Question page
  const questionIndex = currentStep - 1;
  const question = quiz.questions[questionIndex];
  const existingAnswer = session?.answers.find(a => a.questionId === question.id);

  return (
    <div className={styles.wrapper}>
      <QuestionPage
        question={question}
        questionNumber={currentStep}
        totalQuestions={totalQuestions}
        existingAnswer={existingAnswer}
        onAnswer={answerQuestion}
        onNext={() => goToStep(currentStep + 1)}
        onBack={() => goToStep(currentStep - 1)}
        isFirst={currentStep === 1}
        isLast={currentStep === totalQuestions}
      />
    </div>
  );
}
