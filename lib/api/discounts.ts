import apiClient from './client';
import { DiscountCode } from '@/types/discount';

export const discountsApi = {
    // Validate discount code
    async validateCode(code: string): Promise<DiscountCode> {
        const response = await apiClient.post('/api/discounts/validate', { code });
        return response.data.discount;
    },
};
