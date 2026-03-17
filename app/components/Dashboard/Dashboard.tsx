'use client';

import { useState } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useQuiz } from '../../hooks/useQuiz';
import { QuestionType } from '../../types';
import QuizForm from './QuizForm/QuizForm';
import QuestionEditor from './QuestionEditor/QuestionEditor';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const {
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
  } = useQuiz();

  const [newTitle, setNewTitle] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createQuiz(newTitle.trim(), '');
    setNewTitle('');
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !quiz) return;

    const { source, destination, type } = result;

    if (type === 'question') {
      const ids = quiz.questions.map(q => q.id);
      const [moved] = ids.splice(source.index, 1);
      ids.splice(destination.index, 0, moved);
      reorderQuestions(ids);
    } else if (type.startsWith('choice-')) {
      const questionId = type.replace('choice-', '');
      const question = quiz.questions.find(q => q.id === questionId);
      if (!question) return;
      const ids = question.choices.map(c => c.id);
      const [moved] = ids.splice(source.index, 1);
      ids.splice(destination.index, 0, moved);
      reorderChoices(questionId, ids);
    }
  };

  if (!quiz) {
    return (
      <div className={styles.container}>
        <div className={styles.createSection}>
          <h2>Create Your Quiz</h2>
          <p>Get started by giving your quiz a title</p>
          <form className={styles.createForm} onSubmit={handleCreate}>
            <input
              className={styles.input}
              type="text"
              placeholder="Quiz title..."
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
            />
            <button className={styles.btnPrimary} type="submit">
              Create Quiz
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Quiz Builder</h2>
        <button className={styles.btnDanger} onClick={deleteQuiz}>
          Delete Quiz
        </button>
      </div>

      <QuizForm
        title={quiz.title}
        description={quiz.description}
        onUpdateTitle={title => updateQuiz({ title })}
        onUpdateDescription={description => updateQuiz({ description })}
      />

      <div className={styles.questionsHeader}>
        <h3>Questions ({quiz.questions.length})</h3>
        <div className={styles.addBtnGroup}>
          <button className={styles.btnSecondary} onClick={() => addQuestion('radio')}>
            + Radio
          </button>
          <button className={styles.btnSecondary} onClick={() => addQuestion('checkbox')}>
            + Checkbox
          </button>
          <button className={styles.btnSecondary} onClick={() => addQuestion('text')}>
            + Text
          </button>
        </div>
      </div>

      {quiz.questions.length === 0 ? (
        <div className={styles.emptyQuestions}>
          No questions yet. Add your first question above.
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="questions" type="question">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {quiz.questions.map((question, index) => (
                  <QuestionEditor
                    key={question.id}
                    question={question}
                    index={index}
                    onUpdate={(partial) => updateQuestion(question.id, partial)}
                    onRemove={() => removeQuestion(question.id)}
                    onAddChoice={() => addChoice(question.id)}
                    onUpdateChoice={(choiceId, partial) => updateChoice(question.id, choiceId, partial)}
                    onRemoveChoice={(choiceId) => removeChoice(question.id, choiceId)}
                    onAttachProducts={(choiceId, productIds) => attachProducts(question.id, choiceId, productIds)}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}
