import { Quiz, QuizSession } from '../types';

const QUIZ_KEY = 'quiz_app_quiz';
const SESSION_KEY = 'quiz_app_session';

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getStoredQuiz(): Quiz | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(QUIZ_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredQuiz(quiz: Quiz): void {
  if (!isBrowser()) return;
  localStorage.setItem(QUIZ_KEY, JSON.stringify(quiz));
}

export function getStoredSession(): QuizSession | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredSession(session: QuizSession): void {
  if (!isBrowser()) return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearStoredSession(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(SESSION_KEY);
}
