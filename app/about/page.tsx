'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Users, Heart, Award, ShoppingBag, ArrowLeft, Check } from 'lucide-react';

export default function AboutPage() {
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
                        <Link href="/">
                            <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Retour
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-16">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        Les Délices du Verger
                    </h1>
                    <h2 className="text-3xl md:text-4xl font-semibold text-gray-700 mb-8">
                        Qui sommes-nous ?
                    </h2>
                </div>

                {/* Story Section */}
                <Card className="p-8 md:p-12 mb-12 border-none shadow-xl bg-white/80 backdrop-blur-sm">
                    <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed">
                        <p>
                            Les Delices du Verger, c'est l'histoire de <strong className="text-green-600">Wajdi</strong>, jeune entrepreneur
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

                {/* Team Section */}
                <div className="mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
                        Notre équipe
                    </h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Card className="p-6 border-none shadow-lg bg-white/80 backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-xl">
                                    W
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">Wajdi</h3>
                                    <p className="text-sm text-gray-600">Fondateur et Responsable des 3 boutiques</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 border-none shadow-lg bg-white/80 backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-xl">
                                    K
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">Khalil</h3>
                                    <p className="text-sm text-gray-600">Comptabilité et gestion administrative</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 border-none shadow-lg bg-white/80 backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-xl">
                                    W
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">Wassim</h3>
                                    <p className="text-sm text-gray-600">Achats des produits frais à Rungis</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 border-none shadow-lg bg-white/80 backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-xl">
                                    R
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">Ridha</h3>
                                    <p className="text-sm text-gray-600">Achats des produits frais à Rungis</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 border-none shadow-lg bg-white/80 backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-xl">
                                    T
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">Taher</h3>
                                    <p className="text-sm text-gray-600">Conseiller en boutique et mise en valeur des produits</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 border-none shadow-lg bg-white/80 backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-xl">
                                    A
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">Abdel</h3>
                                    <p className="text-sm text-gray-600">Conseiller en boutique et mise en valeur des produits</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 border-none shadow-lg bg-white/80 backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-xl">
                                    B
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">Bassem</h3>
                                    <p className="text-sm text-gray-600">Conseiller en boutique et mise en valeur des produits</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 border-none shadow-lg bg-white/80 backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-xl">
                                    M
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">Moez</h3>
                                    <p className="text-sm text-gray-600">Conseiller en boutique et mise en valeur des produits</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="p-6 border-none shadow-lg bg-white/80 backdrop-blur-sm">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white font-bold text-xl">
                                    I
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">Ismail</h3>
                                    <p className="text-sm text-gray-600">Conseiller en boutique et mise en valeur des produits</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Commitment Section */}
                <div className="mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
                        Notre engagement
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        <Card className="p-8 text-center border-none shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
                            <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-4">
                                <Award className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Qualité</h3>
                            <p className="text-gray-700">Sélection rigoureuse de produits frais et savoureux</p>
                        </Card>
                        <Card className="p-8 text-center border-none shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
                            <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-4">
                                <Heart className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Proximité</h3>
                            <p className="text-gray-700">Un service local, réactif et humain</p>
                        </Card>
                        <Card className="p-8 text-center border-none shadow-xl bg-gradient-to-br from-green-50 to-emerald-50">
                            <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 mb-4">
                                <ShoppingBag className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Simplicité</h3>
                            <p className="text-gray-700">Commande livrée rapidement chez vous</p>
                        </Card>
                    </div>
                </div>

                {/* Closing Message */}
                <Card className="p-12 text-center border-none shadow-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Bienvenue chez nous,
                    </h2>
                    <h3 className="text-2xl md:text-3xl font-semibold mb-6">
                        Bienvenue chez Les Delices du Verger,
                    </h3>
                    <p className="text-xl text-white/90">
                        votre partenaire gourmand du quotidien !
                    </p>
                </Card>
            </div>
        </div>
    );
}








