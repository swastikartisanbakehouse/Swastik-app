export interface User {
  id: number;
  name: string | null;
  email: string;
  mobile_number: string | null;
  whatsapp_number: string | null;
  addresses: Address[];
  is_staff: boolean;
  is_superuser: boolean;
  created_at: string;
}

export interface Address {
  type: string;
  address_line1: string;
  city: string;
  pincode: string;
  is_default: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  mobile_number?: string;
  whatsapp_number?: string;
}
