import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products';
import { ProductQueryParams } from '../types/product';

export function useProducts(params?: ProductQueryParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.getAll(params),
    staleTime: 2 * 60 * 1000,
  });
}

export function useProductSearch(query: string) {
  return useQuery({
    queryKey: ['products-search', query],
    queryFn: () => productsApi.search(query),
    enabled: query.trim().length > 0,
    staleTime: 30 * 1000,
  });
}
