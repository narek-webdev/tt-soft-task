import { Quiz, Answer, ApiProduct } from '../types';

export function getRecommendedProducts(
  quiz: Quiz,
  answers: Answer[],
  allProducts: ApiProduct[]
): ApiProduct[] {
  const productFrequency = new Map<number, number>();

  for (const answer of answers) {
    if (answer.selectedChoiceIds.length === 0) continue;

    const question = quiz.questions.find(q => q.id === answer.questionId);
    if (!question) continue;

    for (const choiceId of answer.selectedChoiceIds) {
      const choice = question.choices.find(c => c.id === choiceId);
      if (!choice) continue;

      for (const productId of choice.attachedProductIds) {
        productFrequency.set(
          productId,
          (productFrequency.get(productId) || 0) + 1
        );
      }
    }
  }

  const sortedProductIds = [...productFrequency.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([id]) => id);

  return sortedProductIds
    .map(id => allProducts.find(p => p.id === id))
    .filter((p): p is ApiProduct => p !== undefined);
}
