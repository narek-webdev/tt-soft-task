// === API Types ===
export interface ApiCategory {
  id: number;
  name: string;
  slug: string;
  image: string;
}

export interface ApiProduct {
  id: number;
  title: string;
  slug: string;
  price: number;
  description: string;
  category: ApiCategory;
  images: string[];
}

// === Quiz Domain Types ===
export type QuestionType = 'radio' | 'checkbox' | 'text';

export interface Choice {
  id: string;
  label: string;
  attachedProductIds: number[];
  order: number;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  type: QuestionType;
  choices: Choice[];
  order: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

// === Quiz Session Types ===
export interface Answer {
  questionId: string;
  selectedChoiceIds: string[];
  textValue: string;
}

export interface QuizSession {
  quizId: string;
  currentStep: number; // 0 = welcome, 1..N = questions, N+1 = results
  answers: Answer[];
}
