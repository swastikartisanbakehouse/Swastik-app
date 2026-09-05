import { useQuery } from '@tanstack/react-query';
import { productsApi } from '../api/products';

export function useProduct(id: number) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsApi.getById(id),
    staleTime: 2 * 60 * 1000,
    enabled: !!id,
  });
}
