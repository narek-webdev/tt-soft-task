'use client';

import { useState, useEffect, useCallback } from 'react';
import { ApiProduct } from '../../../types';
import { sanitizeImageUrl } from '../../../hooks/useProducts';
import styles from './ProductPicker.module.css';

const API_BASE = 'https://api.escuelajs.co/api/v1/products';

interface ProductPickerProps {
  selectedIds: number[];
  onConfirm: (ids: number[]) => void;
  onClose: () => void;
}

export default function ProductPicker({ selectedIds, onConfirm, onClose }: ProductPickerProps) {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<number>>(new Set(selectedIds));

  const fetchProducts = useCallback(async (query?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = query
        ? `${API_BASE}?title=${encodeURIComponent(query)}&offset=0&limit=20`
        : `${API_BASE}?offset=0&limit=20`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setProducts(data);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(search || undefined);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, fetchProducts]);

  const toggleProduct = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Attach Products</h3>
          <button className={styles.closeBtn} onClick={onClose}>×</button>
        </div>

        <div className={styles.searchBox}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.productList}>
          {loading && <div className={styles.loading}>Loading products...</div>}
          {error && <div className={styles.error}>{error}</div>}
          {!loading && !error && products.map(product => (
            <div
              key={product.id}
              className={`${styles.productItem} ${selected.has(product.id) ? styles.selected : ''}`}
              onClick={() => toggleProduct(product.id)}
            >
              <input
                className={styles.checkbox}
                type="checkbox"
                checked={selected.has(product.id)}
                onChange={() => toggleProduct(product.id)}
              />
              <img
                className={styles.productImage}
                src={sanitizeImageUrl(product.images?.[0] || '')}
                alt={product.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="%23f0f0f0"/></svg>';
                }}
              />
              <div className={styles.productInfo}>
                <div className={styles.productTitle}>{product.title}</div>
                <div className={styles.productPrice}>${product.price}</div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <button className={styles.confirmBtn} onClick={() => onConfirm([...selected])}>
            Confirm ({selected.size})
          </button>
        </div>
      </div>
    </div>
  );
}
