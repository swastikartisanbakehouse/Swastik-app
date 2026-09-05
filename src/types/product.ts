import { Category } from './category';

export interface Product {
  id: number;
  sku: string;
  name: string;
  category_id: number;
  category_detail: Category | null;
  subcategory_name: string | null;
  description: string | null;
  price: string;
  discount_price: string | null;
  tax_percentage: string | null;
  unit: string;
  stock_quantity: number;
  is_available: boolean;
  is_active: boolean;
  image: string | null;
  brand: string | null;
  tags: string[];
  attributes: Record<string, unknown>;
  created_at: string;
}

export interface ProductQueryParams {
  search?: string;
  sector?: string;
  category_id?: number;
  in_stock?: boolean;
  subcategory?: string;
}

// Lightweight cart representation of a product
export interface CartItem {
  productId: number;
  name: string;
  price: string;        // effective price (discount_price if available, else price)
  originalPrice: string;
  unit: string;
  image: string | null;
  quantity: number;
  is_available: boolean;
}
