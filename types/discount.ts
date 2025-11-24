// Discount code types
export interface DiscountCode {
    id: string;
    code: string;
    type: 'percentage' | 'fixed';
    discount: number;
    active: boolean;
    minOrderAmount?: number;
    maxUses?: number;
    usedCount?: number;
    expiresAt?: string;
}

export interface ApplyDiscountResponse {
    valid: boolean;
    discount: DiscountCode;
    message?: string;
}
