export interface Category {
  id: number;
  name: string;
  sector: 'BAKERY' | 'DAIRY' | 'SWEETS' | 'CONFECTIONERY';
  sector_display: string;
  description: string | null;
  image: string | null;
  is_active: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
}
