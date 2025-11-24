'use client';

import { useState, useEffect } from 'react';
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
import { Search, Heart, ShoppingCart, Grid, List, ChevronRight, ChevronLeft } from 'lucide-react';
import { formatPrice, getVariantDisplay } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';
import { toast } from 'sonner';

export default function ProductsPage() {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const { addToCart, favorites, addToFavorites, removeFromFavorites } = useStore();

    const { data: productsData, isLoading } = useQuery({
        queryKey: ['products', selectedCategory, search, currentPage],
        queryFn: () => productsApi.getProducts({
            category: selectedCategory || undefined,
            search: search || undefined,
            page: currentPage,
            limit: 12,
        }),
    });

    // Reset to page 1 when category or search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCategory, search]);

    // Get category image from constants
    const getCategoryImage = (categoryName: string) => {
        const category = CATEGORIES.find(cat => cat.name === categoryName);
        return category?.image || 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg';
    };

    const handleAddToCart = (product: any) => {
        const defaultVariant = product.variants[0];
        addToCart(product, defaultVariant);
        toast.success('Produit ajouté au panier!');
    };

    const toggleFavorite = (product: any) => {
        const isFav = favorites.some(f => f.id === product.id);
        if (isFav) {
            removeFromFavorites(product.id);
            toast.info('Retiré des favoris');
        } else {
            addToFavorites(product);
            toast.success('Ajouté aux favoris');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50">
            <ProductsHeader />

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Nos <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Produits</span>
                    </h1>
                    <p className="text-gray-600 text-lg mb-6">
                        {productsData?.total || 0} produits frais disponibles
                    </p>
                    
                    {/* Categories Carousel */}
                    <div className="mb-8 relative">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide flex-1">
                                <button
                                    onClick={() => setSelectedCategory(null)}
                                    className={`flex-shrink-0 flex flex-col items-center gap-2 px-5 py-4 rounded-xl transition-all border-2 min-w-[130px] shadow-sm ${!selectedCategory ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-500 text-green-700 font-medium shadow-md scale-105' : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50 text-gray-700 bg-white hover:shadow-md'}`}
                                >
                                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-lg">
                                        Tous
                                    </div>
                                    <span className="text-xs font-semibold text-center">Tous</span>
                                </button>
                                {CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => setSelectedCategory(cat.name)}
                                        className={`flex-shrink-0 flex flex-col items-center gap-2 px-5 py-4 rounded-xl transition-all border-2 min-w-[130px] shadow-sm ${selectedCategory === cat.name ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-500 shadow-md scale-105' : 'border-gray-200 hover:border-green-300 hover:shadow-md bg-white'}`}
                                    >
                                        <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-md">
                                            <img
                                                src={getCategoryImage(cat.name)}
                                                alt={cat.name}
                                                className="w-full h-full object-cover"
                                            />
                                            {selectedCategory === cat.name && (
                                                <div className="absolute inset-0 bg-green-500/30 ring-2 ring-green-500" />
                                            )}
                                        </div>
                                        <span className={`text-xs font-semibold text-center truncate w-full ${selectedCategory === cat.name ? 'text-green-700' : 'text-gray-700'}`}>
                                            {cat.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                            <div className="flex-shrink-0 flex items-center justify-end pl-4">
                                <div className="flex items-center gap-1 text-gray-400 text-sm animate-pulse">
                                    <span className="text-xs">Défiler</span>
                                    <ChevronRight className="h-5 w-5" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Rechercher un produit..."
                                className="pl-10 h-12 bg-white border-2 border-gray-200 focus:border-green-500 rounded-xl shadow-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'bg-green-600 hover:bg-green-700' : ''}>
                            <Grid className="h-4 w-4 mr-2" />
                            Grille
                        </Button>
                        <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'bg-green-600 hover:bg-green-700' : ''}>
                            <List className="h-4 w-4 mr-2" />
                            Liste
                        </Button>
                    </div>
                </div>

                {/* Products Grid/List */}
                <div>
                        {isLoading ? (
                            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                                {Array.from({ length: 9 }).map((_, i) => (
                                    <Card key={i} className="overflow-hidden">
                                        <Skeleton className="h-64 w-full" />
                                        <div className="p-6 space-y-3">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-6 w-full" />
                                            <Skeleton className="h-8 w-32" />
                                            <Skeleton className="h-10 w-full" />
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : productsData?.products && productsData.products.length > 0 ? (
                            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
                                {productsData.products.map((product) => {
                                    const isFavorite = favorites.some(f => f.id === product.id);
                                    const variant = product.variants && product.variants.length > 0 ? product.variants[0] : null;
                                    return (
                                        <Card key={product.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border-none bg-white">
                                            {viewMode === 'grid' ? (
                                                <>
                                                    <div className="relative h-64 overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
                                                        <img src={product.Image} alt={product.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        <Button size="icon" variant="secondary" className="absolute top-4 right-4 rounded-full bg-white/90 hover:bg-white" onClick={() => toggleFavorite(product)}>
                                                            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                                                        </Button>
                                                        <Badge className="absolute bottom-4 left-4 bg-green-600">{product.category}</Badge>
                                                    </div>
                                                    <div className="p-6">
                                                        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-green-600 transition">{product.title}</h3>
                                                        <div className="flex items-center justify-between mb-4">
                                                            <span className="text-2xl font-bold text-green-600">{formatPrice(variant?.price || 0)}</span>
                                                            <span className="text-sm text-gray-500">{variant ? getVariantDisplay(variant) : 'unité'}</span>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700" onClick={() => handleAddToCart(product)}>
                                                                <ShoppingCart className="mr-2 h-4 w-4" />Ajouter
                                                            </Button>
                                                            <Link href={`/products/${product.id}`}>
                                                                <Button variant="outline">Voir</Button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex gap-6 p-6">
                                                    <div className="relative w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
                                                        <img src={product.Image} alt={product.title} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 flex flex-col justify-between">
                                                        <div>
                                                            <Badge className="mb-2 bg-green-600">{product.category}</Badge>
                                                            <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                                                            <p className="text-gray-600 text-sm line-clamp-2">{product.description || 'Produit frais de qualité'}</p>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <div>
                                                                <span className="text-3xl font-bold text-green-600">{formatPrice(variant?.price || 0)}</span>
                                                                <span className="text-gray-500 ml-2">/ {variant ? getVariantDisplay(variant) : 'unité'}</span>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button size="icon" variant="outline" onClick={() => toggleFavorite(product)}>
                                                                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                                                                </Button>
                                                                <Button className="bg-gradient-to-r from-green-600 to-emerald-600" onClick={() => handleAddToCart(product)}>
                                                                    <ShoppingCart className="mr-2 h-4 w-4" />Ajouter au panier
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
                                <Button onClick={() => { setSearch(''); setSelectedCategory(null); }} variant="outline">Réinitialiser les filtres</Button>
                            </Card>
                        )}

                        {/* Pagination */}
                        {productsData && productsData.totalPages > 1 && (
                            <div className="mt-12 space-y-4">
                                <div className="flex items-center justify-center gap-2 flex-wrap">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1 || isLoading}
                                        className="flex items-center gap-2"
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
                                                // Show all pages if 7 or fewer
                                                for (let i = 1; i <= totalPages; i++) {
                                                    pages.push(i);
                                                }
                                            } else {
                                                // Show first page
                                                pages.push(1);
                                                
                                                if (current > 3) {
                                                    pages.push('...');
                                                }
                                                
                                                // Show pages around current
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
                                                
                                                // Show last page
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
                                                        className={currentPage === page ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
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
                                        className="flex items-center gap-2"
                                    >
                                        Suivant
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Page Info */}
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
