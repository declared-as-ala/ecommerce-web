import apiClient from './client';
import { Order } from '@/types/order';

export const ordersApi = {
    // Get user's orders
    async getMyOrders(): Promise<Order[]> {
        const response = await apiClient.get('/api/orders/my');
        return response.data.data;
    },

    // Get single order
    async getOrder(id: string): Promise<Order> {
        const response = await apiClient.get(`/api/orders/${id}`);
        return response.data;
    },

    // Create order (for cash payment)
    async createOrder(orderData: any): Promise<Order> {
        const response = await apiClient.post('/api/orders', orderData);
        return response.data;
    },
};
