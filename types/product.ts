// Product types matching backend model
export interface ProductVariant {
  variant_id: string;
  variant_name: string;
  price: number;
  unit_type: 'weight' | 'piece';
  grams: number | null;
  options: Array<{
    name: string;
    value: string;
  }>;
}

export interface Product {
  id: string;
  title: string;
  Image: string;
  description?: string;
  category: string;
  variants: ProductVariant[];
  rawVariantsExist?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  image?: string;
  description?: string;
}

export interface ProductsResponse {
  products: Product[];
  hasMore: boolean;
  total: number;
  currentPage: number;
  totalPages: number;
}
