import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '../api/categories';

export const CATEGORIES_QUERY_KEY = ['categories'] as const;

export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: categoriesApi.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoriesApi.getById(id),
    staleTime: 5 * 60 * 1000,
    enabled: !!id,
  });
}

export function useCategoryProducts(categoryId: number) {
  return useQuery({
    queryKey: ['category-products', categoryId],
    queryFn: () => categoriesApi.getProducts(categoryId),
    staleTime: 2 * 60 * 1000,
    enabled: !!categoryId,
  });
}
