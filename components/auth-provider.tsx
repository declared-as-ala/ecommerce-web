'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useStore } from '@/lib/store';
import { authApi } from '@/lib/api/auth';
import { Customer } from '@/types/customer';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setUser, isAuthenticated, user } = useStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isInitialized, setIsInitialized] = useState(false);

    // Pages that don't require authentication (including home page, products, and cart)
    const publicPages = ['/login', '/register', '/forgot-password', '/', '/products', '/about', '/cart'];
    const isPublicPage = publicPages.includes(pathname) || pathname?.startsWith('/products/');
    
    // Pages that require authentication
    const protectedPages = ['/checkout', '/orders', '/profile'];
    const isProtectedPage = protectedPages.some(page => pathname?.startsWith(page));

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('accessToken');

            if (token) {
                try {
                    // Always fetch fresh user data from /me endpoint
                        const freshUser = await authApi.me();
                        setUser(freshUser);
                } catch (error) {
                    console.error('Failed to fetch user from /me:', error);
                    // Token is invalid, clear it
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    setUser(null);
                    
                    // Redirect to login only if on a protected page
                    if (isProtectedPage) {
                        router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
                    }
                }
            } else {
                // No token, clear user state
                setUser(null);
                
                // Redirect to login only if on a protected page
                if (isProtectedPage) {
                    router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
                }
            }
            
            setIsInitialized(true);
        };

        initAuth();
    }, [setUser, router, pathname, isPublicPage]);

    // Show loading state while initializing
    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return <>{children}</>;
}
