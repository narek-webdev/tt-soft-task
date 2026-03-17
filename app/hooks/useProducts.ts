'use client';

import { useState, useEffect, useCallback } from 'react';
import { ApiProduct } from '../types';

const API_BASE = 'https://api.escuelajs.co/api/v1/products';

export function useProducts() {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = search
        ? `${API_BASE}?title=${encodeURIComponent(search)}&offset=0&limit=20`
        : `${API_BASE}?offset=0&limit=50`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductsByIds = useCallback(async (ids: number[]): Promise<ApiProduct[]> => {
    if (ids.length === 0) return [];
    try {
      const results = await Promise.all(
        ids.map(async (id) => {
          const res = await fetch(`${API_BASE}/${id}`);
          if (!res.ok) return null;
          return res.json();
        })
      );
      return results.filter((p): p is ApiProduct => p !== null);
    } catch {
      return [];
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, fetchProducts, fetchProductsByIds };
}

export function sanitizeImageUrl(url: string): string {
  if (!url) return '';
  return url.replace(/[\[\]"]/g, '').trim();
}
