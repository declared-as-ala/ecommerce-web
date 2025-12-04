import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Heart } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-green-500/40">
                                <img src="/logo.png" alt="Les Délices" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                    Les Délices
                                </h3>
                                <p className="text-sm text-gray-400">du Verger</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Votre source de confiance pour des produits frais de qualité supérieure, livrés avec soin.
                        </p>
                        {/* Social Media */}
                        <div className="flex items-center gap-3 pt-2">
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-green-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
                                aria-label="Facebook"
                            >
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-pink-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
                                aria-label="Instagram"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a
                                href="#"
                                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-500 flex items-center justify-center transition-all duration-300 hover:scale-110"
                                aria-label="Twitter"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-lg mb-4 text-white">Liens Rapides</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/products" className="text-gray-400 hover:text-green-400 transition-colors inline-flex items-center group">
                                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                                    Produits
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-green-400 transition-colors inline-flex items-center group">
                                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                                    À propos
                                </Link>
                            </li>
                            <li>
                                <Link href="/favorites" className="text-gray-400 hover:text-green-400 transition-colors inline-flex items-center group">
                                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                                    Favoris
                                </Link>
                            </li>
                            <li>
                                <Link href="/cart" className="text-gray-400 hover:text-green-400 transition-colors inline-flex items-center group">
                                    <span className="w-0 group-hover:w-2 h-0.5 bg-green-400 transition-all duration-300 mr-0 group-hover:mr-2"></span>
                                    Panier
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-bold text-lg mb-4 text-white">Contact</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-gray-400">
                                <Mail className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm">Email</p>
                                    <a href="mailto:contact@lesdelices.fr" className="hover:text-green-400 transition-colors">
                                        contact@lesdelices.fr
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 text-gray-400">
                                <Phone className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm">Téléphone</p>
                                    <a href="tel:+33123456789" className="hover:text-green-400 transition-colors">
                                        +33 1 23 45 67 89
                                    </a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 text-gray-400">
                                <MapPin className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="text-sm">Nos Boutiques</p>
                                    <p className="text-sm">Paris 20ème • Vincennes<br />Gournay-sur-Marne</p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold text-lg mb-4 text-white">Newsletter</h4>
                        <p className="text-gray-400 text-sm mb-4">
                            Abonnez-vous pour recevoir nos offres exclusives
                        </p>
                        <div className="space-y-3">
                            <input
                                type="email"
                                placeholder="votre@email.com"
                                className="w-full px-4 py-2.5 rounded-lg bg-gray-800 border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all text-white placeholder-gray-500"
                            />
                            <button className="w-full px-4 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-medium transition-all hover:shadow-lg hover:shadow-green-500/30">
                                S'abonner
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-400 text-center md:text-left">
                            &copy; {new Date().getFullYear()} Les Délices du Verger. Tous droits réservés.
                        </p>
                        <p className="text-sm text-gray-400 flex items-center gap-2">
                            Made with <Heart className="h-4 w-4 text-red-500 fill-current animate-pulse" /> in France
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
