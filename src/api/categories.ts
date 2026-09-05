import { apiClient } from './client';
import { Category } from '../types/category';
import { Product } from '../types/product';

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/api/categories/');
    return response.data;
  },

  getById: async (id: number): Promise<Category> => {
    const response = await apiClient.get<Category>(`/api/categories/${id}/`);
    return response.data;
  },

  getProducts: async (categoryId: number): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(`/api/categories/${categoryId}/products/`);
    return response.data;
  },
};
