'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselItem } from '@/components/ui/carousel';
import { ShoppingCart, Package, Truck, Shield, Star, ArrowRight, Sparkles, Heart, Award, Tag, Users } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/lib/api/products';
import { useStore } from '@/lib/store';
import { formatPrice } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { addToCart, isAuthenticated, user, logout, cart } = useStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Fetch featured products for carousel
  const { data: productsData } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productsApi.getProducts({ limit: 12 }),
  });

  // Fetch products from different categories for featured section
  const { data: featuredProductsData } = useQuery({
    queryKey: ['featured-products-by-category'],
    queryFn: async () => {
      // Get products from different categories using CATEGORIES constant
      const uniqueCategories = CATEGORIES.slice(0, 6).map(cat => cat.name);
      const productsByCategory = await Promise.all(
        uniqueCategories.map(async (category) => {
          try {
            const response = await productsApi.getProducts({ category, limit: 1 });
            return response.products[0];
          } catch (error) {
            return null;
          }
        })
      );
      
      // Filter out null values and return products
      return productsByCategory.filter((product) => product !== null);
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-green-500/20 group-hover:ring-green-500/40 transition-all">
                <img src="/logo.png" alt="Les Délices" className="object-cover" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Les Délices
                </h1>
                <p className="text-xs text-gray-500">du Verger</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              {isAuthenticated ? (
                <>
                  <Link href="/products" className="text-gray-700 hover:text-green-600 transition font-medium">
                    Produits
                  </Link>
                  <Link href="/about" className="text-gray-700 hover:text-green-600 transition font-medium">
                    Qui sommes-nous
                  </Link>
                  <Link href="/orders" className="text-gray-700 hover:text-green-600 transition font-medium">
                    Commandes
                  </Link>
                  <Link href="/cart" className="text-gray-700 hover:text-green-600 transition font-medium relative">
                    Panier
                    {mounted && cart.length > 0 && (
                      <span className="absolute -top-2 -right-3 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                  <Link href="/profile">
                    <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                      {user?.firstName || 'Profil'}
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/products" className="text-gray-700 hover:text-green-600 transition font-medium">
                    Produits
                  </Link>
                  <Link href="/about" className="text-gray-700 hover:text-green-600 transition font-medium">
                    Qui sommes-nous
                  </Link>
                  <Link href="/cart" className="text-gray-700 hover:text-green-600 transition font-medium relative">
                    Panier
                    {mounted && cart.length > 0 && (
                      <span className="absolute -top-2 -right-3 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                      Connexion
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      S'inscrire
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-emerald-600/5" />
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {isLoading ? (
                <>
                  <Skeleton className="h-16 w-3/4" />
                  <Skeleton className="h-24 w-full" />
                  <div className="flex gap-4">
                    <Skeleton className="h-12 w-40" />
                    <Skeleton className="h-12 w-32" />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                      <Sparkles className="h-4 w-4" />
                      Produits 100% Frais
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                      Fruits & Légumes{' '}
                      <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        Fraîcheur Premium
                      </span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                      Découvrez notre sélection de produits frais de qualité supérieure,
                      livrés avec soin directement à votre porte.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4">
                    <Link href="/products">
                      <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg px-8 py-6 rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all">
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        Explorer la Boutique
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    {!isAuthenticated && (
                    <Link href="/register">
                      <Button size="lg" variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50 text-lg px-8 py-6 rounded-xl">
                        Créer un Compte
                      </Button>
                    </Link>
                    )}
                  </div>

                  <div className="flex items-center gap-8 pt-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-green-500/20">
                      <img src="/logo.png" alt="Les Délices" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-5 w-5 fill-current" />
                        <Star className="h-5 w-5 fill-current" />
                        <Star className="h-5 w-5 fill-current" />
                        <Star className="h-5 w-5 fill-current" />
                        <Star className="h-5 w-5 fill-current" />
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Users className="h-4 w-4 text-gray-600" />
                        <p className="text-sm text-gray-600">1000+ clients satisfaits</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="relative">
              {isLoading ? (
                <Skeleton className="h-96 w-full rounded-3xl" />
              ) : (
                <div className="relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-2xl opacity-20" />
                  <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { name: 'Pommes', image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop', gradient: 'from-red-500/20 to-red-600/20' },
                        { name: 'Oranges', image: 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400&h=400&fit=crop', gradient: 'from-orange-500/20 to-orange-600/20' },
                        { name: 'Fraises', image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop', gradient: 'from-pink-500/20 to-pink-600/20' },
                        { name: 'Raisins', image: 'https://v2.lesplaisirsfruites.com/wp-content/uploads/2020/09/raisins-blanc-noir.png', gradient: 'from-purple-500/20 to-purple-600/20' },
                      ].map((fruit, index) => (
                        <div key={index} className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br relative group">
                          <img
                            src={fruit.image}
                            alt={fruit.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className={`absolute inset-0 bg-gradient-to-t ${fruit.gradient} from-black/60 via-black/20 to-transparent`} />
                          <div className="absolute bottom-3 left-3 right-3">
                            <p className="text-white text-sm font-semibold drop-shadow-lg">{fruit.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '100+', label: 'Produits Frais', icon: Package, color: 'green' },
              { value: '1K+', label: 'Clients Heureux', icon: Heart, color: 'red' },
              { value: '5★', label: 'Note Moyenne', icon: Star, color: 'yellow' },
              { value: '24/7', label: 'Service Client', icon: Shield, color: 'blue' },
            ].map((stat, i) => (
              <Card key={i} className="p-6 text-center hover:shadow-lg transition-all hover:-translate-y-1 border-none bg-gradient-to-br from-white to-gray-50">
                {isLoading ? (
                  <>
                    <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
                    <Skeleton className="h-8 w-20 mx-auto mb-2" />
                    <Skeleton className="h-4 w-24 mx-auto" />
                  </>
                ) : (
                  <>
                    <div className={`inline-flex p-3 rounded-full bg-${stat.color}-100 text-${stat.color}-600 mb-4`}>
                      <stat.icon className="h-8 w-8" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                    <p className="text-gray-600">{stat.label}</p>
                  </>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Products Carousel */}
      {productsData?.products && productsData.products.length > 0 && (
        <section className="py-20 bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Nos <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Produits</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Découvrez notre sélection de produits frais
              </p>
            </div>

            <Carousel className="max-w-7xl mx-auto" autoPlay={true} interval={4000}>
              {Array.from({ length: Math.ceil((productsData.products.length || 0) / 3) }).map((_, slideIndex) => (
                <CarouselItem key={slideIndex}>
                  <div className="grid md:grid-cols-3 gap-6 px-4">
                    {productsData.products
                      .slice(slideIndex * 3, slideIndex * 3 + 3)
                      .map((product) => (
                        <Card key={product.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-none bg-white">
                          <div className="relative h-64 overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
                            <img
                              src={product.Image}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-4 right-4">
                              <Button size="icon" variant="secondary" className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="absolute bottom-4 left-4">
                              <span className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-medium">
                                {product.category}
                              </span>
                            </div>
                          </div>
                          <div className="p-6">
                            <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-green-600 transition">
                              {product.title}
                            </h3>
                            <div className="flex items-center justify-between mb-4">
                              <span className="text-2xl font-bold text-green-600">
                                {formatPrice(product.variants[0]?.price || 0)}
                              </span>
                              <span className="text-sm text-gray-500">
                                {product.variants[0]?.unit_type === 'weight' ? 'au kg' : 'pièce'}
                              </span>
                            </div>
                            <Link href={`/products/${product.id}`}>
                              <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                Ajouter au panier
                              </Button>
                            </Link>
                          </div>
                        </Card>
                      ))}
                  </div>
                </CarouselItem>
              ))}
            </Carousel>

            <div className="text-center mt-12">
              <Link href="/products">
                <Button size="lg" variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50">
                  Voir tous les produits
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Categories Carousel */}
      {CATEGORIES && CATEGORIES.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Nos <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Catégories</span>
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Explorez nos différentes catégories de produits
              </p>
            </div>

            <Carousel className="max-w-7xl mx-auto" autoPlay={true} interval={5000}>
              {Array.from({ length: Math.ceil(CATEGORIES.length / 4) }).map((_, slideIndex) => (
                <CarouselItem key={slideIndex}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4">
                    {CATEGORIES
                      .slice(slideIndex * 4, slideIndex * 4 + 4)
                      .map((category: { id: string; name: string; description: string }, idx: number) => (
                        <Link key={category.id} href={`/products?category=${encodeURIComponent(category.name)}`}>
                          <Card className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-none bg-gradient-to-br from-green-50 to-emerald-50 cursor-pointer">
                            <div className="p-8 text-center">
                              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-4 group-hover:scale-110 transition-transform">
                                <Tag className="h-8 w-8 text-white" />
                              </div>
                              <h3 className="font-bold text-lg text-gray-900 group-hover:text-green-600 transition">
                                {category.name}
                              </h3>
                            </div>
                          </Card>
                        </Link>
                      ))}
                  </div>
                </CarouselItem>
              ))}
            </Carousel>
          </div>
        </section>
      )}

      {/* Featured Products Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Nos <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Produits Vedettes</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Découvrez une sélection de nos produits les plus populaires
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="h-64 w-full" />
                  <div className="p-6 space-y-3">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-8 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </Card>
              ))
            ) : (featuredProductsData && featuredProductsData.length > 0 ? featuredProductsData : productsData?.products?.slice(0, 6) || []).filter((product) => product && product.Image).map((product) => (
              <Card key={product.id} className="group overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-none bg-white">
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50">
                  <img
                    src={product.Image || '/placeholder.png'}
                    alt={product.title || 'Product'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Button size="icon" variant="secondary" className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-green-600 text-white text-xs font-medium">
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-green-600 transition">
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-green-600">
                      {formatPrice(product.variants[0]?.price || 0)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {product.variants[0]?.unit_type === 'weight' ? 'au kg' : 'pièce'}
                    </span>
                  </div>
                  <Link href={`/products/${product.id}`}>
                    <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Ajouter au panier
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products">
              <Button size="lg" variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-50">
                Voir tous les produits
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Package,
                title: 'Produits 100% Frais',
                description: 'Sélection quotidienne de produits de qualité premium',
                gradient: 'from-green-500 to-emerald-500'
              },
              {
                icon: Truck,
                title: 'Livraison Express',
                description: 'Livraison rapide à domicile ou retrait en magasin',
                gradient: 'from-blue-500 to-cyan-500'
              },
              {
                icon: Shield,
                title: 'Paiement Sécurisé',
                description: 'Stripe, PayPal et paiement à la livraison acceptés',
                gradient: 'from-purple-500 to-pink-500'
              }
            ].map((feature, i) => (
              <Card key={i} className="p-8 text-center hover:shadow-xl transition-all hover:-translate-y-1 border-none bg-white group">
                {isLoading ? (
                  <>
                    <Skeleton className="h-16 w-16 rounded-2xl mx-auto mb-6" />
                    <Skeleton className="h-6 w-3/4 mx-auto mb-3" />
                    <Skeleton className="h-16 w-full" />
                  </>
                ) : (
                  <>
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform`}>
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  </>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Les Délices du Verger</h3>
              <p className="text-gray-400 text-sm">
                Votre source de confiance pour des produits frais de qualité.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Liens Rapides</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/products" className="hover:text-white transition">Produits</Link></li>
                <li><Link href="/about" className="hover:text-white transition">À propos</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-sm text-gray-400">
                Email: contact@lesdelices.fr<br />
                Tél: +33 1 23 45 67 89
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Les Délices du Verger. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
