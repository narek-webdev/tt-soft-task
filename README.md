# Quiz Builder

A quiz builder and quiz taker application built with Next.js, React, and TypeScript. Create custom quizzes with multiple question types, drag-and-drop reordering, and product recommendations based on user answers.

## Features

- **Quiz Builder (Dashboard)** — Create quizzes with a title, description, and multiple questions
- **Question Types** — Radio (single choice), checkbox (multiple choice), and text input
- **Drag & Drop** — Reorder questions and answer choices via drag-and-drop
- **Product Recommendations** — Attach products to choices; top products are recommended based on answers
- **Quiz Taker** — Step-by-step quiz flow with progress indicator, navigation, and a results page
- **Persistent Storage** — Quizzes are saved to localStorage (no backend required)

## Tech Stack

| Layer       | Technology                  |
| ----------- | --------------------------- |
| Framework   | Next.js 16                  |
| Language    | TypeScript 5                |
| UI          | React 19                    |
| Styling     | CSS Modules                 |
| Drag & Drop | @hello-pangea/dnd           |
| Linting     | ESLint 9 + Next.js config   |
| Deployment  | GitHub Pages (static export)|

## Requirements

- **Node.js** >= 20
- **npm** (comes with Node.js)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Lint the code

```bash
npm run lint
```

## Build

Generate a static production build in the `out/` directory:

```bash
npm run build
```

The project is configured with `output: "export"` in `next.config.ts`, so the build produces a fully static site that can be served from any static file host.

## Deployment

The project deploys automatically to **GitHub Pages** via GitHub Actions.

### How it works

1. Push to the `master` branch (or trigger manually via workflow dispatch)
2. The CI workflow installs dependencies, builds the static export, and uploads the `out/` directory
3. The artifact is deployed to GitHub Pages

### Manual deployment

If you want to deploy manually:

```bash
npm run build
# then serve or upload the `out/` directory to any static hosting provider
```

> **Note:** The app is configured with `basePath: "/tt-soft-task"` and `assetPrefix: "/tt-soft-task/"` in `next.config.ts`. Update these values if deploying to a different path.

## Project Structure

```
app/
├── components/
│   ├── Dashboard/      # Quiz builder UI (QuizForm, QuestionEditor, ChoiceEditor, ProductPicker)
│   ├── Quiz/           # Quiz taker UI (WelcomePage, QuestionPage, ResultPage, ProductCard)
│   └── Navigation/     # Tab switcher between Dashboard and Quiz
├── hooks/              # Custom React hooks (useQuiz, useQuizSession, useLocalStorage, useProducts)
├── types/              # TypeScript interfaces (Quiz, Question, Choice, Answer)
├── utils/              # Helpers (localStorage wrapper, recommendation algorithm)
├── globals.css         # Global styles and CSS variables
├── layout.tsx          # Root layout
└── page.tsx            # Entry point
```

## License

This project is private and not licensed for redistribution.
