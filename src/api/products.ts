import { apiClient } from './client';
import { Product, ProductQueryParams } from '../types/product';

export const productsApi = {
  getAll: async (params?: ProductQueryParams): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/api/products/', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`/api/products/${id}/`);
    return response.data;
  },

  search: async (query: string): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/api/products/', {
      params: { search: query },
    });
    return response.data;
  },
};
