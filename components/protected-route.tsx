'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';

export function ProtectedRoute({
    children,
    requireAuth = true
}: {
    children: React.ReactNode;
    requireAuth?: boolean;
}) {
    const router = useRouter();
    const { isAuthenticated } = useStore();

    useEffect(() => {
        if (requireAuth && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, requireAuth, router]);

    if (requireAuth && !isAuthenticated) {
        return null;
    }

    return <>{children}</>;
}
