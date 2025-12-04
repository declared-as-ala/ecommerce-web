'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Carousel, CarouselItem } from '@/components/ui/carousel';
import { ShoppingCart, Package, Truck, Shield, Star, ArrowRight, Sparkles, Heart, Tag, Users, Menu, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api/products';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';
import { toast } from 'sonner';
import { ProductImage } from '@/components/ProductImage';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const { addToCart, isAuthenticated, user, logout, cart, favorites, addToFavorites, removeFromFavorites } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch featured products for carousel
  const { data: productsData } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productsApi.getProducts({ limit: 12 }),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Header */}
      <Navbar />

      {/* Hero Section with Categories Carousel */}
      <section className="relative overflow-hidden pt-8 sm:pt-12 md:pt-16 pb-12 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-emerald-600/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium animate-fade-in">
              <Sparkles className="h-4 w-4" />
              Produits 100% Frais
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight animate-slide-up">
              Fruits & Légumes{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent block sm:inline">
                Fraîcheur Premium
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto px-4 animate-slide-up" style={{ animationDelay: '150ms' }}>
              Découvrez notre sélection de produits frais de qualité supérieure,
              livrés avec soin directement à votre porte.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up" style={{ animationDelay: '300ms' }}>
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-base sm:text-lg px-6 sm:px-8 py-6 rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all hover:-translate-y-1">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Explorer la Boutique
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-green-600 text-green-600 hover:bg-green-50 text-base sm:text-lg px-6 sm:px-8 py-6 rounded-xl hover:shadow-md transition-all">
                    Créer un Compte
                  </Button>
                </Link>
              )}
            </div>
            <div className="flex items-center justify-center gap-4 sm:gap-8 pt-4 animate-fade-in" style={{ animationDelay: '450ms' }}>
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden ring-2 ring-green-500/20">
                <img src="/logo.png" alt="Les Délices" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                  <Star className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                  <p className="text-xs sm:text-sm text-gray-600">1000+ clients satisfaits</p>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Scrollable Grid */}
          {CATEGORIES && CATEGORIES.length > 0 && (
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-6 sm:mb-8 animate-fade-in" style={{ animationDelay: '600ms' }}>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                  Explorez nos <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Catégories</span>
                </h2>
                <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
                  Parcourez notre large gamme de produits frais
                </p>
              </div>
              <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-100">
                <div className="flex gap-3 sm:gap-4 md:gap-6 px-2 sm:px-4 min-w-max">
                  {CATEGORIES.map((category: { id: string; name: string; description: string; image?: string }) => (
                    <Link
                      key={category.id}
                      href={`/products?category=${encodeURIComponent(category.name)}`}
                      className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px]"
                    >
                      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-none bg-white cursor-pointer h-full">
                        <div className="relative h-28 sm:h-36 md:h-44 overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="inline-flex p-3 sm:p-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 group-hover:scale-110 transition-transform">
                                <Tag className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                              </div>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="p-3 sm:p-4 text-center">
                          <h3 className="font-semibold text-xs sm:text-sm md:text-base text-gray-900 group-hover:text-green-600 transition line-clamp-2">
                            {category.name}
                          </h3>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Products Scrollable Section */}
      {productsData?.products && productsData.products.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-8 md:mb-12 animate-fade-in">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4">
                Nos <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Produits</span>
              </h2>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
                Découvrez notre sélection de produits frais
              </p>
            </div>

            <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-gray-100">
              <div className="flex gap-3 sm:gap-4 md:gap-6 px-2 sm:px-4 min-w-max">
                {productsData.products.slice(0, 12).map((product) => {
                  const isFavorite = favorites.some(f => f.id === product.id);
                  return (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className="flex-shrink-0 w-[200px] sm:w-[240px] md:w-[280px]"
                    >
                      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-none bg-white cursor-pointer h-full">
                        <div className="relative h-32 sm:h-40 md:h-48 overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
                          <ProductImage
                            src={product.Image}
                            alt={product.title}
                            fill
                            className="group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                            <Button
                              size="icon"
                              variant="secondary"
                              className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (isFavorite) {
                                  removeFromFavorites(product.id);
                                  toast.info('Retiré des favoris');
                                } else {
                                  addToFavorites(product);
                                  toast.success('Ajouté aux favoris');
                                }
                              }}
                            >
                              <Heart className={`h-3 w-3 sm:h-4 sm:w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                            </Button>
                          </div>
                          <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3">
                            <span className="px-2 sm:px-3 py-1 rounded-full bg-green-600 text-white text-xs font-medium">
                              {product.category}
                            </span>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="p-3 sm:p-4 md:p-5">
                          <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-2 line-clamp-2 group-hover:text-green-600 transition">
                            {product.title}
                          </h3>
                          <div className="flex items-center justify-between mb-3 sm:mb-4">
                            <span className="text-lg sm:text-xl md:text-2xl font-bold text-green-600">
                              {formatPrice(product.variants[0]?.price || 0)}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-500">
                              {product.variants[0]?.unit_type === 'weight' ? 'au kg' : 'pièce'}
                            </span>
                          </div>
                          <Button
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-xs sm:text-sm"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              addToCart(product, product.variants[0]);
                              toast.success('Produit ajouté au panier!');
                            }}
                          >
                            <ShoppingCart className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            Ajouter
                          </Button>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="text-center mt-6 sm:mt-8 md:mt-12">
              <Link href="/products">
                <Button size="lg" variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50 text-sm sm:text-base">
                  Voir tous les produits
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 md:mb-16 animate-fade-in">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
              Pourquoi <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Nous Choisir</span>
            </h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
              Découvrez les avantages qui font de nous votre partenaire de confiance
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Package,
                title: 'Produits 100% Frais',
                subtitle: 'Sélection quotidienne de produits de qualité premium',
                gradient: 'from-green-500 to-emerald-500',
                bgGradient: 'from-green-50 to-emerald-50',
                iconBg: 'from-green-500 to-emerald-600'
              },
              {
                icon: Truck,
                title: 'Livraison Express',
                subtitle: 'Livraison rapide à domicile ou retrait en magasin',
                gradient: 'from-blue-500 to-cyan-500',
                bgGradient: 'from-blue-50 to-cyan-50',
                iconBg: 'from-blue-500 to-cyan-600'
              },
              {
                icon: Shield,
                title: 'Paiement Sécurisé',
                subtitle: 'Stripe, PayPal et paiement à la livraison acceptés',
                gradient: 'from-purple-500 to-pink-500',
                bgGradient: 'from-purple-50 to-pink-50',
                iconBg: 'from-purple-500 to-pink-600'
              }
            ].map((feature, i) => (
              <Card
                key={i}
                className={`group p-6 sm:p-8 text-center border-none bg-gradient-to-br ${feature.bgGradient} hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden relative animate-slide-up`}
                style={{ animationDelay: `${i * 150}ms` }}
              >
                {/* Decorative background element */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/30 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

                {/* Icon */}
                <div className="relative z-10 mb-6">
                  <div className={`inline-flex p-4 sm:p-5 rounded-2xl bg-gradient-to-br ${feature.iconBg} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <feature.icon className="h-7 w-7 sm:h-9 sm:w-9 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900 group-hover:text-green-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    {feature.subtitle}
                  </p>
                </div>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r ${feature.gradient} group-hover:w-full transition-all duration-500 rounded-full`}></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
