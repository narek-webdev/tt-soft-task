'use client';

import { ApiProduct } from '../../../types';
import { sanitizeImageUrl } from '../../../hooks/useProducts';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: ApiProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageUrl = sanitizeImageUrl(product.images?.[0] || '');
  const reviewCount = Math.floor(Math.random() * 20) + 5;

  return (
    <div className={styles.card}>
      <img
        className={styles.image}
        src={imageUrl}
        alt={product.title}
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="180"><rect width="200" height="180" fill="%23f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-size="14">No Image</text></svg>';
        }}
      />
      <div className={styles.body}>
        <div className={styles.rating}>
          <span className={styles.stars}>★★★★★</span>
          <span className={styles.reviews}>{reviewCount} reviews</span>
        </div>
        <div className={styles.productTitle}>{product.title}</div>
        <div className={styles.price}>${product.price}</div>
        <button className={styles.addToCart}>Add To Cart</button>
        <p className={styles.description}>{product.description}</p>
      </div>
    </div>
  );
}
