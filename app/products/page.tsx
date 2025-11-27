'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api/products';
import { useStore } from '@/lib/store';
import { ProductsHeader } from '@/components/products-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Search, Heart, ShoppingCart, Grid, List, ChevronRight, ChevronLeft, X, Filter } from 'lucide-react';
import { formatPrice, getVariantDisplay } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';
import { toast } from 'sonner';
import { ProductImage } from '@/components/ProductImage';
import { CategoryFilter } from '@/components/CategoryFilter';

// Debounce hook for search
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default function ProductsPage() {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const { addToCart, favorites, addToFavorites, removeFromFavorites } = useStore();

    // Debounce search input
    const debouncedSearch = useDebounce(search, 300);

    const { data: productsData, isLoading } = useQuery({
        queryKey: ['products', selectedCategory, debouncedSearch, currentPage],
        queryFn: () => productsApi.getProducts({
            category: selectedCategory || undefined,
            search: debouncedSearch || undefined,
            page: currentPage,
            limit: 12,
        }),
    });

    // Reset to page 1 when category or search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, debouncedSearch]);


    const handleAddToCart = useCallback((product: any) => {
        const defaultVariant = product.variants[0];
        addToCart(product, defaultVariant);
        toast.success('Produit ajouté au panier!');
    }, [addToCart]);

    const toggleFavorite = useCallback((product: any) => {
        const isFav = favorites.some(f => f.id === product.id);
        if (isFav) {
            removeFromFavorites(product.id);
            toast.info('Retiré des favoris');
        } else {
            addToFavorites(product);
            toast.success('Ajouté aux favoris');
        }
    }, [favorites, addToFavorites, removeFromFavorites]);

    const clearFilters = useCallback(() => {
        setSearch('');
        setSelectedCategory(null);
        setCurrentPage(1);
    }, []);

    const hasActiveFilters = search || selectedCategory;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
            <ProductsHeader />

            <div className="container mx-auto px-4 py-6 md:py-8">
                {/* Header Section */}
                <div className="mb-6 md:mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                        Nos <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Produits</span>
                    </h1>
                            <p className="text-gray-600 text-sm md:text-base">
                        {productsData?.total || 0} produits frais disponibles
                    </p>
                        </div>
                        
                        {/* Search Bar - Compact */}
                        <div className="relative max-w-md w-full md:w-auto">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-400" />
                            <Input
                                placeholder="Rechercher un produit..."
                                className="pl-10 h-10 md:h-12 bg-white border-2 border-gray-200 focus:border-green-500 rounded-xl shadow-sm transition-all duration-200"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            {search && (
                                <button
                                    onClick={() => setSearch('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>
                    
                    {/* Categories - Optimized Scrollable Filter */}
                    <CategoryFilter
                        selectedCategory={selectedCategory}
                        onCategoryChange={(category) => {
                            setSelectedCategory(category);
                            setCurrentPage(1);
                        }}
                        onClearFilters={clearFilters}
                        hasActiveFilters={hasActiveFilters}
                    />
                </div>

                {/* View Mode Toggle & Results Count */}
                <div className="flex items-center justify-between mb-4 md:mb-6">
                    <div className="flex items-center gap-2">
                        <Button 
                            variant={viewMode === 'grid' ? 'default' : 'outline'} 
                            size="sm" 
                            onClick={() => setViewMode('grid')} 
                            className={`transition-all duration-200 ${viewMode === 'grid' ? 'bg-green-600 hover:bg-green-700 shadow-md' : ''}`}
                        >
                            <Grid className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Grille</span>
                        </Button>
                        <Button 
                            variant={viewMode === 'list' ? 'default' : 'outline'} 
                            size="sm" 
                            onClick={() => setViewMode('list')} 
                            className={`transition-all duration-200 ${viewMode === 'list' ? 'bg-green-600 hover:bg-green-700 shadow-md' : ''}`}
                        >
                            <List className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Liste</span>
                        </Button>
                    </div>
                    {productsData && (
                        <p className="text-xs md:text-sm text-gray-600">
                            {productsData.total} produit{productsData.total > 1 ? 's' : ''}
                        </p>
                    )}
                </div>

                {/* Products Grid/List */}
                <div className="transition-all duration-300">
                        {isLoading ? (
                        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6' : 'space-y-4'}>
                            {Array.from({ length: 12 }).map((_, i) => (
                                <Card key={i} className="overflow-hidden border-none shadow-md">
                                    <Skeleton className="h-40 md:h-48 w-full" />
                                    <div className="p-4 md:p-5 space-y-3">
                                            <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-5 w-full" />
                                            <Skeleton className="h-8 w-32" />
                                            <Skeleton className="h-10 w-full" />
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : productsData?.products && productsData.products.length > 0 ? (
                        <div className={viewMode === 'grid' 
                            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6' 
                            : 'space-y-3 md:space-y-4'
                        }>
                                {productsData.products.map((product) => {
                                    const isFavorite = favorites.some(f => f.id === product.id);
                                    const variant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
                                    return (
                                    <Card 
                                        key={product.id} 
                                        className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-none bg-white shadow-sm"
                                    >
                                            {viewMode === 'grid' ? (
                                                <>
                                                <div className="relative h-40 md:h-48 overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
                                                    <ProductImage
                                                        src={product.Image}
                                                        alt={product.title}
                                                        fill
                                                        className="group-hover:scale-110 transition-transform duration-500 ease-out"
                                                    />
                                                    <Button 
                                                        size="icon" 
                                                        variant="secondary" 
                                                        className="absolute top-2 right-2 rounded-full bg-white/90 hover:bg-white h-8 w-8 md:h-9 md:w-9 shadow-md transition-all duration-200 hover:scale-110" 
                                                        onClick={() => toggleFavorite(product)}
                                                    >
                                                        <Heart className={`h-4 w-4 transition-all duration-200 ${isFavorite ? 'fill-red-500 text-red-500 scale-110' : ''}`} />
                                                    </Button>
                                                    <Badge className="absolute bottom-2 left-2 bg-green-600 text-xs shadow-md">{product.category}</Badge>
                                                </div>
                                                <div className="p-4 md:p-5">
                                                    <h3 className="font-semibold text-sm md:text-base mb-2 line-clamp-2 group-hover:text-green-600 transition-colors duration-200">
                                                        {product.title}
                                                    </h3>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-lg md:text-xl font-bold text-green-600">
                                                            {formatPrice(variant?.price || 0)}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            {variant ? getVariantDisplay(variant) : 'unité'}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button 
                                                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-xs md:text-sm transition-all duration-200 hover:scale-105 active:scale-95" 
                                                            onClick={() => handleAddToCart(product)}
                                                        >
                                                            <ShoppingCart className="mr-2 h-4 w-4" />
                                                            <span className="hidden sm:inline">Ajouter</span>
                                                            <span className="sm:hidden">+</span>
                                                        </Button>
                                                        <Link href={`/products/${product.id}`}>
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm" 
                                                                className="text-xs md:text-sm transition-all duration-200 hover:scale-105 active:scale-95"
                                                            >
                                                                Voir
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col sm:flex-row gap-4 p-4 md:p-6">
                                                <div className="relative w-full sm:w-32 md:w-40 h-40 sm:h-32 md:h-40 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
                                                    <ProductImage
                                                        src={product.Image}
                                                        alt={product.title}
                                                        fill
                                                        className="group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                    <Badge className="absolute top-2 left-2 bg-green-600 text-xs shadow-md">{product.category}</Badge>
                                                </div>
                                                <div className="flex-1 flex flex-col justify-between gap-3">
                                                    <div className="space-y-2">
                                                        <h3 className="text-base md:text-lg font-semibold leading-tight group-hover:text-green-600 transition-colors duration-200">
                                                            {product.title}
                                                        </h3>
                                                        {product.description && (
                                                            <p className="text-gray-600 text-xs md:text-sm line-clamp-2">
                                                                {product.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xl md:text-2xl font-bold text-green-600">
                                                                {formatPrice(variant?.price || 0)}
                                                            </span>
                                                            <span className="text-xs md:text-sm text-gray-500">
                                                                / {variant ? getVariantDisplay(variant) : 'unité'}
                                                            </span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button 
                                                                size="icon" 
                                                                variant="outline" 
                                                                className="h-9 w-9 md:h-10 md:w-10 transition-all duration-200 hover:scale-110" 
                                                                onClick={() => toggleFavorite(product)}
                                                            >
                                                                <Heart className={`h-4 w-4 transition-all duration-200 ${isFavorite ? 'fill-red-500 text-red-500 scale-110' : ''}`} />
                                                            </Button>
                                                            <Button 
                                                                className="flex-1 sm:flex-initial bg-gradient-to-r from-green-600 to-emerald-600 text-xs md:text-sm transition-all duration-200 hover:scale-105 active:scale-95" 
                                                                onClick={() => handleAddToCart(product)}
                                                            >
                                                                <ShoppingCart className="mr-2 h-4 w-4" />
                                                                <span className="hidden sm:inline">Ajouter</span>
                                                                <span className="sm:hidden">+</span>
                                                            </Button>
                                                        </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : (
                            <Card className="p-12 text-center border-none shadow-lg">
                                <div className="inline-flex p-4 rounded-full bg-gray-100 mb-4">
                                    <Search className="h-12 w-12 text-gray-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun produit trouvé</h3>
                                <p className="text-gray-600 mb-6">Essayez de modifier vos filtres ou votre recherche</p>
                            <Button onClick={clearFilters} variant="outline" className="transition-all duration-200 hover:scale-105">
                                Réinitialiser les filtres
                            </Button>
                            </Card>
                        )}

                        {/* Pagination */}
                        {productsData && productsData.totalPages > 1 && (
                        <div className="mt-8 md:mt-12 space-y-4">
                                <div className="flex items-center justify-center gap-2 flex-wrap">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1 || isLoading}
                                    className="flex items-center gap-2 transition-all duration-200 hover:scale-105 disabled:opacity-50"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Précédent
                                    </Button>
                                    
                                    <div className="flex items-center gap-1">
                                        {(() => {
                                            const pages = [];
                                            const totalPages = productsData.totalPages;
                                            const current = currentPage;
                                            
                                            if (totalPages <= 7) {
                                                for (let i = 1; i <= totalPages; i++) {
                                                    pages.push(i);
                                                }
                                            } else {
                                                pages.push(1);
                                                
                                                if (current > 3) {
                                                    pages.push('...');
                                                }
                                                
                                                const start = Math.max(2, current - 1);
                                                const end = Math.min(totalPages - 1, current + 1);
                                                
                                                for (let i = start; i <= end; i++) {
                                                    if (i !== 1 && i !== totalPages) {
                                                        pages.push(i);
                                                    }
                                                }
                                                
                                                if (current < totalPages - 2) {
                                                    pages.push('...');
                                                }
                                                
                                                pages.push(totalPages);
                                            }
                                            
                                            return pages.map((page, idx) => {
                                                if (page === '...') {
                                                    return (
                                                        <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
                                                            ...
                                                        </span>
                                                    );
                                                }
                                                
                                                return (
                                                    <Button
                                                        key={page}
                                                        variant={currentPage === page ? 'default' : 'outline'}
                                                        size="sm"
                                                        onClick={() => setCurrentPage(page as number)}
                                                    className={`transition-all duration-200 hover:scale-110 ${
                                                        currentPage === page 
                                                            ? 'bg-green-600 hover:bg-green-700 text-white shadow-md' 
                                                            : ''
                                                    }`}
                                                    >
                                                        {page}
                                                    </Button>
                                                );
                                            });
                                        })()}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.min(productsData.totalPages, prev + 1))}
                                        disabled={currentPage === productsData.totalPages || isLoading}
                                    className="flex items-center gap-2 transition-all duration-200 hover:scale-105 disabled:opacity-50"
                                    >
                                        Suivant
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="text-center text-sm text-gray-600">
                                    Page {productsData.currentPage} sur {productsData.totalPages} • {productsData.total} produits au total
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}
