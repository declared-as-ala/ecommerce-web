'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Users, Heart, Award, ShoppingBag, Sparkles, MapPin, Clock, Phone } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50">
            {/* Use the new Navbar component */}
            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 py-16 sm:py-20 md:py-24">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                    }}></div>
                </div>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="max-w-4xl mx-auto text-center text-white space-y-4 sm:space-y-6 animate-fade-in">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-4">
                            <Sparkles className="h-4 w-4" />
                            Notre Histoire
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                            Les Délices du Verger
                        </h1>
                        <p className="text-xl sm:text-2xl md:text-3xl font-light text-white/90">
                            Votre partenaire gourmand du quotidien
                        </p>
                        <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
                            Depuis 2022, nous vous proposons des fruits, légumes et produits d'épicerie fine de qualité supérieure
                        </p>
                    </div>
                </div>
                {/* Decorative wave divider */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
                    </svg>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
                {/* Story Section */}
                <div className="max-w-5xl mx-auto mb-16 sm:mb-20 md:mb-24">
                    <Card className="p-8 sm:p-10 md:p-12 lg:p-16 border-none shadow-premium bg-white/80 backdrop-blur-sm animate-slide-up">
                        <div className="space-y-6 text-base sm:text-lg text-gray-700 leading-relaxed">
                            <p className="text-xl sm:text-2xl font-semibold text-green-700 mb-6">
                                Une passion pour la qualité et la fraîcheur
                            </p>
                            <p>
                                Les Delices du Verger, c'est l'histoire de <strong className="text-green-600 font-bold">Wajdi</strong>, jeune entrepreneur
                                passionné de 23 ans.
                            </p>
                            <p>
                                En 2022, il ouvre sa première boutique dans le 20ème arrondissement de
                                Paris, avec une ambition : proposer des fruits, légumes et produits
                                d'épicerie fine de grande qualité, livrés avec soin à domicile.
                            </p>
                            <p>
                                Grâce à son travail et à sa détermination, il développe rapidement son
                                activité, en reprenant deux nouvelles boutiques à Vincennes et
                                Gournay-sur-Marne, et aujourd'hui, il franchit une nouvelle étape avec la
                                création de son site internet.
                            </p>
                        </div>
                    </Card>
                </div>

                {/* Stats Section */}
                <div className="max-w-5xl mx-auto mb-16 sm:mb-20 md:mb-24">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {[
                            { label: 'Boutiques', value: '3', icon: MapPin },
                            { label: 'Années', value: '2+', icon: Clock },
                            { label: 'Produits Frais', value: '100+', icon: ShoppingBag },
                            { label: 'Clients Satisfaits', value: '1000+', icon: Users }
                        ].map((stat, i) => (
                            <Card
                                key={i}
                                className="p-6 text-center border-none bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in"
                                style={{ animationDelay: `${i * 100}ms` }}
                            >
                                <stat.icon className="h-8 w-8 mx-auto mb-3 text-green-600" />
                                <div className="text-3xl sm:text-4xl font-bold text-green-600 mb-1">{stat.value}</div>
                                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-16 sm:mb-20 md:mb-24">
                    <div className="text-center mb-10 sm:mb-12 md:mb-14 animate-fade-in">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
                            Notre <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Équipe</span>
                        </h2>
                        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                            Des professionnels passionnés à votre service
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {[
                            { name: 'Wajdi', role: 'Fondateur et Responsable des 3 boutiques', initial: 'W', color: 'from-green-400 to-emerald-500' },
                            { name: 'Khalil', role: 'Comptabilité et gestion administrative', initial: 'K', color: 'from-green-500 to-emerald-600' },
                            { name: 'Wassim', role: 'Achats des produits frais à Rungis', initial: 'W', color: 'from-emerald-400 to-green-500' },
                            { name: 'Ridha', role: 'Achats des produits frais à Rungis', initial: 'R', color: 'from-green-600 to-emerald-700' },
                            { name: 'Taher', role: 'Conseiller en boutique et mise en valeur des produits', initial: 'T', color: 'from-emerald-500 to-green-600' },
                            { name: 'Abdel', role: 'Conseiller en boutique et mise en valeur des produits', initial: 'A', color: 'from-green-400 to-emerald-600' },
                            { name: 'Bassem', role: 'Conseiller en boutique et mise en valeur des produits', initial: 'B', color: 'from-emerald-600 to-green-700' },
                            { name: 'Moez', role: 'Conseiller en boutique et mise en valeur des produits', initial: 'M', color: 'from-green-500 to-emerald-500' },
                            { name: 'Ismail', role: 'Conseiller en boutique et mise en valeur des produits', initial: 'I', color: 'from-emerald-400 to-green-400' }
                        ].map((member, i) => (
                            <Card
                                key={i}
                                className="p-6 border-none shadow-lg bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden relative animate-slide-up"
                                style={{ animationDelay: `${i * 50}ms` }}
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-green-100/50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-110 transition-transform`}>
                                        {member.initial}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg text-gray-900 mb-1">{member.name}</h3>
                                        <p className="text-sm text-gray-600 leading-snug">{member.role}</p>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Commitment Section */}
                <div className="mb-16 sm:mb-20 md:mb-24">
                    <div className="text-center mb-10 sm:mb-12 md:mb-14 animate-fade-in">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
                            Notre <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Engagement</span>
                        </h2>
                        <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">
                            Des valeurs qui guident chacune de nos actions
                        </p>
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                        {[
                            {
                                icon: Award,
                                title: 'Qualité',
                                description: 'Sélection rigoureuse de produits frais et savoureux',
                                gradient: 'from-yellow-500 to-orange-500',
                                bgGradient: 'from-yellow-50 to-orange-50'
                            },
                            {
                                icon: Heart,
                                title: 'Proximité',
                                description: 'Un service local, réactif et humain',
                                gradient: 'from-pink-500 to-rose-500',
                                bgGradient: 'from-pink-50 to-rose-50'
                            },
                            {
                                icon: ShoppingBag,
                                title: 'Simplicité',
                                description: 'Commande livrée rapidement chez vous',
                                gradient: 'from-blue-500 to-indigo-500',
                                bgGradient: 'from-blue-50 to-indigo-50'
                            }
                        ].map((commitment, i) => (
                            <Card
                                key={i}
                                className={`p-8 text-center border-none shadow-xl bg-gradient-to-br ${commitment.bgGradient} group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer relative overflow-hidden animate-scale-in`}
                                style={{ animationDelay: `${i * 150}ms` }}
                            >
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/40 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="relative z-10">
                                    <div className={`inline-flex p-5 rounded-2xl bg-gradient-to-br ${commitment.gradient} mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                                        <commitment.icon className="h-8 w-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-3 text-gray-900">{commitment.title}</h3>
                                    <p className="text-gray-700 leading-relaxed">{commitment.description}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Closing Message */}
                <Card className="p-10 sm:p-12 md:p-16 text-center border-none shadow-premium-lg bg-gradient-to-r from-green-600 to-emerald-600 text-white relative overflow-hidden animate-scale-in">
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                        }}></div>
                    </div>
                    <div className="relative z-10">
                        <Sparkles className="h-12 w-12 mx-auto mb-6 animate-pulse" />
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                            Bienvenue chez nous !
                        </h2>
                        <p className="text-xl sm:text-2xl text-white/90 mb-2">
                            Bienvenue chez Les Delices du Verger
                        </p>
                        <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto">
                            Votre partenaire gourmand du quotidien
                        </p>
                    </div>
                </Card>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 sm:py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
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
                        <div>
                            <h4 className="font-semibold mb-4">Nos Boutiques</h4>
                            <p className="text-sm text-gray-400">
                                Paris 20ème • Vincennes • Gournay-sur-Marne
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
                        <p>&copy; {new Date().getFullYear()} Les Délices du Verger. Tous droits réservés.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
