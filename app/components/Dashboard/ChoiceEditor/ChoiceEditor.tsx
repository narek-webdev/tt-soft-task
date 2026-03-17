'use client';

import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Choice } from '../../../types';
import ProductPicker from '../ProductPicker/ProductPicker';
import styles from './ChoiceEditor.module.css';

interface ChoiceEditorProps {
  choice: Choice;
  index: number;
  questionId: string;
  onUpdate: (partial: { label: string }) => void;
  onRemove: () => void;
  onAttachProducts: (productIds: number[]) => void;
}

export default function ChoiceEditor({
  choice,
  index,
  questionId,
  onUpdate,
  onRemove,
  onAttachProducts,
}: ChoiceEditorProps) {
  const [showPicker, setShowPicker] = useState(false);

  const handleRemoveProduct = (productId: number) => {
    onAttachProducts(choice.attachedProductIds.filter(id => id !== productId));
  };

  return (
    <>
      <Draggable draggableId={`${questionId}-${choice.id}`} index={index}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.draggableProps}>
            <div className={styles.choice}>
              <span className={styles.dragHandle} {...provided.dragHandleProps}>
                ⠿
              </span>
              <input
                className={styles.input}
                type="text"
                placeholder="Choice label..."
                value={choice.label}
                onChange={e => onUpdate({ label: e.target.value })}
              />
              <button
                className={`${styles.productsBtn} ${choice.attachedProductIds.length > 0 ? styles.productsBtnActive : ''}`}
                onClick={() => setShowPicker(true)}
              >
                Products ({choice.attachedProductIds.length})
              </button>
              <button className={styles.removeBtn} onClick={onRemove}>
                ×
              </button>
            </div>
            {choice.attachedProductIds.length > 0 && (
              <div className={styles.productChips}>
                {choice.attachedProductIds.map(id => (
                  <span key={id} className={styles.chip}>
                    #{id}
                    <button className={styles.chipRemove} onClick={() => handleRemoveProduct(id)}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </Draggable>
      {showPicker && (
        <ProductPicker
          selectedIds={choice.attachedProductIds}
          onConfirm={(ids) => {
            onAttachProducts(ids);
            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </>
  );
}
