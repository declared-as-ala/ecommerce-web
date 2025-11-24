import apiClient from './client';
import { Product, ProductsResponse } from '@/types/product';

export const productsApi = {
    async getProducts(params?: {
        category?: string;
        search?: string;
        page?: number;
        limit?: number;
    }): Promise<ProductsResponse> {
        const response = await apiClient.get('/api/products', { params });

        // Backend returns { data: [], page, total, pages }
        // We need to map it to { products: [], currentPage, totalPages, hasMore, total }
        if (response.data.data && Array.isArray(response.data.data)) {
            return {
                products: response.data.data,
                total: response.data.total || response.data.data.length,
                currentPage: response.data.page || 1,
                totalPages: response.data.pages || 1,
                hasMore: (response.data.page || 1) < (response.data.pages || 1),
            };
        }

        // Fallback: if backend returns array directly
        if (Array.isArray(response.data)) {
            return {
                products: response.data,
                hasMore: false,
                total: response.data.length,
                currentPage: 1,
                totalPages: 1,
            };
        }

        // Fallback: already in correct format
        return response.data;
    },

    // Get single product by ID
    async getProduct(id: string): Promise<Product> {
        const response = await apiClient.get(`/api/products/${id}`);
        return response.data;
    },

    // Get all categories
    async getCategories(): Promise<string[]> {
        const response = await apiClient.get('/api/products/categories');
        return response.data;
    },
};
