import { Product, ProductVariant } from './product';

// Cart types
export interface CartItem {
    product: Product;
    variant: ProductVariant;
    quantity: number;
}

export interface Cart {
    items: CartItem[];
    total: number;
}
