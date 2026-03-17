'use client';

import { useEffect, useState } from 'react';
import { Quiz, Answer, ApiProduct } from '../../../types';
import { getRecommendedProducts } from '../../../utils/recommendation';
import ProductCard from '../ProductCard/ProductCard';
import styles from './ResultPage.module.css';

const API_BASE = 'https://api.escuelajs.co/api/v1/products';

interface ResultPageProps {
  quiz: Quiz;
  answers: Answer[];
  onRestart: () => void;
}

export default function ResultPage({ quiz, answers, onRestart }: ResultPageProps) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Determine the result label from the most-selected choice of the first radio question
  const getResultLabel = (): string => {
    for (const question of quiz.questions) {
      if (question.type === 'radio') {
        const answer = answers.find(a => a.questionId === question.id);
        if (answer && answer.selectedChoiceIds.length > 0) {
          const choice = question.choices.find(c => c.id === answer.selectedChoiceIds[0]);
          if (choice && choice.label) return choice.label;
        }
      }
    }
    return 'Unique';
  };

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);

      // Collect all product IDs from selected choices
      const allProductIds = new Set<number>();
      for (const answer of answers) {
        const question = quiz.questions.find(q => q.id === answer.questionId);
        if (!question) continue;
        for (const choiceId of answer.selectedChoiceIds) {
          const choice = question.choices.find(c => c.id === choiceId);
          if (choice) {
            choice.attachedProductIds.forEach(id => allProductIds.add(id));
          }
        }
      }

      if (allProductIds.size === 0) {
        // No products attached, fetch some defaults
        try {
          const res = await fetch(`${API_BASE}?offset=0&limit=3`);
          const data = await res.json();
          setProducts(data);
        } catch {
          setProducts([]);
        }
        setLoading(false);
        return;
      }

      // Fetch all needed products
      try {
        const fetched = await Promise.all(
          [...allProductIds].map(async (id) => {
            try {
              const res = await fetch(`${API_BASE}/${id}`);
              if (!res.ok) return null;
              return await res.json();
            } catch {
              return null;
            }
          })
        );
        const allProducts = fetched.filter((p): p is ApiProduct => p !== null);
        const recommended = getRecommendedProducts(quiz, answers, allProducts);
        setProducts(recommended.length > 0 ? recommended : allProducts.slice(0, 3));
      } catch {
        setProducts([]);
      }
      setLoading(false);
    };

    loadProducts();
  }, [quiz, answers]);

  const resultLabel = getResultLabel();

  return (
    <div className={styles.card}>
      <h2 className={styles.resultTitle}>
        Your Result Is: <span className={styles.resultHighlight}>{resultLabel}</span>
      </h2>
      <div className={styles.divider} />
      <p className={styles.resultDescription}>
        Based on your answers, we have curated a selection of products just for you.
        Check out our recommendations below!
      </p>

      <h3 className={styles.productsHeading}>Products We Recommend For You:</h3>

      {loading ? (
        <div className={styles.loading}>Loading recommendations...</div>
      ) : products.length > 0 ? (
        <div className={styles.productsGrid}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className={styles.noProducts}>No product recommendations available.</div>
      )}

      <button className={styles.restartBtn} onClick={onRestart}>
        Retake Quiz
      </button>
    </div>
  );
}
