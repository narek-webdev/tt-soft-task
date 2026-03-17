'use client';

import { Draggable, Droppable } from '@hello-pangea/dnd';
import { Question, QuestionType } from '../../../types';
import ChoiceEditor from '../ChoiceEditor/ChoiceEditor';
import styles from './QuestionEditor.module.css';

interface QuestionEditorProps {
  question: Question;
  index: number;
  onUpdate: (partial: Partial<Pick<Question, 'title' | 'description' | 'type'>>) => void;
  onRemove: () => void;
  onAddChoice: () => void;
  onUpdateChoice: (choiceId: string, partial: { label: string }) => void;
  onRemoveChoice: (choiceId: string) => void;
  onAttachProducts: (choiceId: string, productIds: number[]) => void;
}

export default function QuestionEditor({
  question,
  index,
  onUpdate,
  onRemove,
  onAddChoice,
  onUpdateChoice,
  onRemoveChoice,
  onAttachProducts,
}: QuestionEditorProps) {
  return (
    <Draggable draggableId={question.id} index={index}>
      {(provided) => (
        <div
          className={styles.card}
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className={styles.cardHeader}>
            <span className={styles.dragHandle} {...provided.dragHandleProps}>
              ⠿
            </span>
            <span className={styles.questionNumber}>Q{index + 1}</span>
            <select
              className={styles.typeSelect}
              value={question.type}
              onChange={e => onUpdate({ type: e.target.value as QuestionType })}
            >
              <option value="radio">Radio (Single)</option>
              <option value="checkbox">Checkbox (Multiple)</option>
              <option value="text">Text Input</option>
            </select>
            <button className={styles.deleteBtn} onClick={onRemove}>
              Delete
            </button>
          </div>
          <div className={styles.cardBody}>
            <input
              className={styles.input}
              type="text"
              placeholder="Question title..."
              value={question.title}
              onChange={e => onUpdate({ title: e.target.value })}
            />
            <textarea
              className={styles.textarea}
              placeholder="Question description (optional)..."
              value={question.description}
              onChange={e => onUpdate({ description: e.target.value })}
            />

            {question.type !== 'text' && (
              <div className={styles.choicesSection}>
                <div className={styles.choicesLabel}>Choices</div>
                <Droppable droppableId={`choices-${question.id}`} type={`choice-${question.id}`}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {question.choices.map((choice, choiceIndex) => (
                        <ChoiceEditor
                          key={choice.id}
                          choice={choice}
                          index={choiceIndex}
                          questionId={question.id}
                          onUpdate={(partial) => onUpdateChoice(choice.id, partial)}
                          onRemove={() => onRemoveChoice(choice.id)}
                          onAttachProducts={(productIds) => onAttachProducts(choice.id, productIds)}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <button className={styles.addChoiceBtn} onClick={onAddChoice}>
                  + Add Choice
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
