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

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
      <header className="border-b bg-white/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group flex-shrink-0">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden ring-2 ring-green-500/20 group-hover:ring-green-500/40 transition-all">
                <img src="/logo.png" alt="Les Délices" className="object-cover w-full h-full" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Les Délices <span className="text-gray-700">du Verger</span>
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {isAuthenticated ? (
                <>
                  <Link href="/products" className="text-gray-700 hover:text-green-600 transition font-medium text-sm xl:text-base">
                    Produits
                  </Link>
                  <Link href="/about" className="text-gray-700 hover:text-green-600 transition font-medium text-sm xl:text-base">
                    Qui sommes-nous
                  </Link>
                  <Link href="/orders" className="text-gray-700 hover:text-green-600 transition font-medium text-sm xl:text-base">
                    Commandes
                  </Link>
                  <Link href="/cart" className="text-gray-700 hover:text-green-600 transition font-medium relative text-sm xl:text-base">
                    Panier
                    {mounted && cart.length > 0 && (
                      <span className="absolute -top-2 -right-3 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                  <Link href="/profile">
                    <Button variant="outline" size="sm" className="border-green-600 text-green-600 hover:bg-green-50">
                      {user?.firstName || 'Profil'}
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/products" className="text-gray-700 hover:text-green-600 transition font-medium text-sm xl:text-base">
                    Produits
                  </Link>
                  <Link href="/about" className="text-gray-700 hover:text-green-600 transition font-medium text-sm xl:text-base">
                    Qui sommes-nous
                  </Link>
                  <Link href="/cart" className="text-gray-700 hover:text-green-600 transition font-medium relative text-sm xl:text-base">
                    Panier
                    {mounted && cart.length > 0 && (
                      <span className="absolute -top-2 -right-3 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="sm" className="border-green-600 text-green-600 hover:bg-green-50">
                      Connexion
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button size="sm" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      S'inscrire
                    </Button>
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:text-green-600 transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="lg:hidden pb-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link href="/products" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-md transition">
                    Produits
                  </Link>
                  <Link href="/about" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-md transition">
                    Qui sommes-nous
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-md transition">
                    Commandes
                  </Link>
                  <Link href="/cart" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-md transition relative">
                    Panier
                    {mounted && cart.length > 0 && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                  <Link href="/profile" className="block px-4 py-2">
                    <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                      {user?.firstName || 'Profil'}
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/products" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-md transition">
                    Produits
                  </Link>
                  <Link href="/about" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-md transition">
                    Qui sommes-nous
                  </Link>
                  <Link href="/cart" className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-md transition relative">
                    Panier
                    {mounted && cart.length > 0 && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {cart.length}
                      </span>
                    )}
                  </Link>
                  <div className="px-4 space-y-2">
                    <Link href="/login">
                      <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                        Connexion
                      </Button>
                    </Link>
                    <Link href="/register">
                      <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                        S'inscrire
                      </Button>
                    </Link>
                  </div>
                </>
              )}
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section with Categories Carousel */}
      <section className="relative overflow-hidden pt-8 sm:pt-12 md:pt-16 pb-12 md:pb-20">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 to-emerald-600/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Produits 100% Frais
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Fruits & Légumes{' '}
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent block sm:inline">
                Fraîcheur Premium
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto px-4">
              Découvrez notre sélection de produits frais de qualité supérieure,
              livrés avec soin directement à votre porte.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/products" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-base sm:text-lg px-6 sm:px-8 py-6 rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Explorer la Boutique
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              {!isAuthenticated && (
                <Link href="/register" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-green-600 text-green-600 hover:bg-green-50 text-base sm:text-lg px-6 sm:px-8 py-6 rounded-xl">
                    Créer un Compte
                  </Button>
                </Link>
              )}
            </div>
            <div className="flex items-center justify-center gap-4 sm:gap-8 pt-4">
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
              <div className="text-center mb-6 sm:mb-8">
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
            <div className="text-center mb-6 sm:mb-8 md:mb-12">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
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
              <Card key={i} className="p-6 sm:p-8 text-center hover:shadow-xl transition-all hover:-translate-y-1 border-none bg-white group">
                <div className={`inline-flex p-3 sm:p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-4 sm:mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div>
              <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4">Les Délices du Verger</h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                Votre source de confiance pour des produits frais de qualité.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Liens Rapides</h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-400">
                <li><Link href="/products" className="hover:text-white transition">Produits</Link></li>
                <li><Link href="/about" className="hover:text-white transition">À propos</Link></li>
                <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Contact</h4>
              <p className="text-xs sm:text-sm text-gray-400">
                Email: contact@lesdelices.fr<br />
                Tél: +33 1 23 45 67 89
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-gray-400">
            <p>&copy; 2024 Les Délices du Verger. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
