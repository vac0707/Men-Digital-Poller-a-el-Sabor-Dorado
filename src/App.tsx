/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Utensils, 
  MapPin, 
  Clock, 
  Phone, 
  Instagram, 
  Facebook, 
  ArrowRight, 
  Flame, 
  Star, 
  Award,
  ChevronDown,
  ShoppingCart,
  X
} from 'lucide-react';
import { MENU_PRODUCTS, Category, Product, CartItem, ProductCustomizations, Review, OrderType } from './types';
import { FoodCard } from './components/FoodCard';
import ChatAssistant from './components/ChatAssistant';

const REVIEWS: Review[] = [
  { id: 'r1', userName: 'Carlos M.', rating: 5, comment: '¡El mejor pollo a la brasa que he probado en Abancay! Las papas son increíbles.', avatar: 'https://i.pravatar.cc/150?u=carlos', date: 'Hace 2 días' },
  { id: 'r2', userName: 'Lucía G.', rating: 5, comment: 'El Mostrito Especial es gigante y el sabor ahumado es perfecto. Súper recomendado.', avatar: 'https://i.pravatar.cc/150?u=lucia', date: 'Hace 1 semana' },
  { id: 'r3', userName: 'Roberto P.', rating: 4, comment: 'Muy rico y el envío fue súper rápido. Llegó calientito.', avatar: 'https://i.pravatar.cc/150?u=roberto', date: 'Hace 3 días' },
];

const CATEGORIES: Category[] = [
  { id: 'all', name: 'Todo', icon: '🍽️' },
  { id: 'pollo', name: 'Pollos', icon: '🍗' },
  { id: 'mostrito', name: 'Mostritos', icon: '🍛' },
  { id: 'combo', name: 'Combos', icon: '💥' },
  { id: 'complemento', name: 'Piqueos', icon: '🍟' },
  { id: 'bebida', name: 'Bebidas', icon: '🥤' },
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [scrolled, setScrolled] = useState(false);
  
  // Cart States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [orderType, setOrderType] = useState<OrderType>('delivery');

  // Modal temporary state
  const [selectedGuarnicion, setSelectedGuarnicion] = useState('Papas Fritas');
  const [selectedEnsalada, setSelectedEnsalada] = useState('Frescas');
  const [selectedCremas, setSelectedCremas] = useState<string[]>([]);

  // Customer Info States
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cart Functions
  const handleAddClick = (product: Product) => {
    // For drinks or simple items, add directly. For chicken, show customization.
    if (product.category === 'pollo' || product.category === 'combo' || product.category === 'mostrito') {
      setSelectedGuarnicion('Papas Fritas');
      setSelectedEnsalada('Frescas');
      setSelectedCremas(['Mayonesa', 'Mostaza', 'Ketchup', 'Ají']); // Default cremas
      setCustomizingProduct(product);
    } else {
      addToCart(product);
    }
  };

  const toggleCrema = (crema: string) => {
    setSelectedCremas(prev => 
      prev.includes(crema) ? prev.filter(c => c !== crema) : [...prev, crema]
    );
  };

  const addToCart = (product: Product, customizations?: ProductCustomizations) => {
    const newItem: CartItem = {
      id: Math.random().toString(36).substr(2, 9),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      customizations
    };
    setCart([...cart, newItem]);
    setCustomizingProduct(null);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const totalCart = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const sendWhatsAppOrder = () => {
    const itemsList = cart.map(item => {
      let desc = `- ${item.quantity}x ${item.name}`;
      if (item.customizations) {
        const cust = [];
        if (item.customizations.ensalada) cust.push(`Ensalada: ${item.customizations.ensalada}`);
        if (item.customizations.guarnicion) cust.push(`Guarnición: ${item.customizations.guarnicion}`);
        if (item.customizations.cremas?.length) cust.push(`Cremas: ${item.customizations.cremas.join(', ')}`);
        if (cust.length) desc += ` (${cust.join(' | ')})`;
      }
      return desc;
    }).join('\n');

    const typeText = orderType === 'delivery' ? 'DELIVERY 🛵' : 'PEDIDO PARA LOCAL/RECOJO 🍗';
    const contactInfo = `\n\n*Cliente:* ${customerName || 'No especificado'}\n*Teléfono:* ${customerPhone || 'No especificado'}`;
    const addressLine = orderType === 'delivery' ? `\n*Dirección:* ${customerAddress || 'Falta especificar'}` : '\n*Recojo en:* Local/Tienda';

    const message = encodeURIComponent(`¡Hola El Sabor Dorado! Quiero hacer un pedido para *${typeText}*:\n\n${itemsList}\n\n*Total: S/${totalCart.toFixed(2)}*${contactInfo}${addressLine}`);
    window.open(`https://wa.me/932350348?text=${message}`, '_blank');
  };

  const filteredProducts = activeCategory === 'all' 
    ? MENU_PRODUCTS 
    : MENU_PRODUCTS.filter(p => p.category === activeCategory);

  const featuredPromos = [
    {
      title: 'Martes de Oferta',
      subtitle: '1/4 de Pollo + Papas',
      desc: 'Solo por S/18.00 todos los martes',
      color: 'bg-primary',
      text: 'text-white'
    },
    {
      title: 'Combo Mostrito',
      subtitle: 'Mostrito + Chicha',
      desc: 'Ahorra S/5.00 pidiendo este combo',
      color: 'bg-secondary',
      text: 'text-accent'
    },
    {
      title: 'Familiar King',
      subtitle: 'El Pollo Más Grande',
      desc: 'Pollo XL para toda la familia',
      color: 'bg-accent',
      text: 'text-white'
    }
  ];

  return (
    <div className="min-h-screen bg-dark text-white font-sans selection:bg-primary selection:text-white" style={{ background: 'radial-gradient(circle at top right, #333, #121212)' }}>
      {/* Header / Navbar */}
      <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300 bg-black/80 backdrop-blur-md border-b-2 border-primary py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex flex-col">
            <div className="logo text-2xl font-black text-secondary uppercase tracking-wider">
              El Sabor Dorado
            </div>
            <div className="location-top flex items-center text-xs text-white/70">
              <MapPin size={10} className="mr-1" /> Jr. Huancavelica 452, Abancay
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#menu" className="font-semibold text-white/80 hover:text-secondary transition-colors uppercase text-xs tracking-widest">Pollos</a>
            <a href="#promos" className="font-semibold text-white/80 hover:text-secondary transition-colors uppercase text-xs tracking-widest">Mostritos</a>
            <a href="#nosotros" className="font-semibold text-white/80 hover:text-secondary transition-colors uppercase text-xs tracking-widest">Sobre Nosotros</a>
          </nav>

          <a 
            href="https://wa.me/932350348" 
            target="_blank" 
            className="bg-primary hover:bg-red-700 text-white px-6 py-3 rounded-full font-black text-xs transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-primary/20"
          >
            <Phone size={14} />
            LLAMAR AHORA
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&q=80&w=2000" 
            alt="Pollo Hero" 
            className="w-full h-full object-cover scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-accent/90 via-accent/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-accent to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="hero-tagline inline-block text-secondary font-black text-xs uppercase tracking-[0.2em] mb-4">
               Pollería + Brasa Artesanal
            </span>
            <h1 className="hero-title text-5xl sm:text-7xl text-white mb-6 leading-[1] font-black uppercase">
              EL VERDADERO SABOR<br />
              DEL POLO A LA BRASA
            </h1>
            <p className="text-white/70 text-base mb-10 font-medium max-w-lg leading-relaxed">
              Traspasamos la frontera del sabor con nuestra receta secreta, papas 100% naturales y las cremas más adictivas de la ciudad. 
            </p>
            <div className="flex flex-wrap gap-4">
              <a 
                href="#menu" 
                className="bg-white hover:bg-secondary text-dark px-10 py-4 rounded-full font-black flex items-center gap-3 transition-all active:scale-95 shadow-2xl text-sm uppercase tracking-wider"
              >
                VER OFERTAS DEL DÍA
                <ArrowRight size={18} />
              </a>
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-3xl border border-white/20">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-accent overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
                    </div>
                  ))}
                </div>
                <div className="text-white text-sm">
                  <p className="font-bold">+2k Clientes Felices</p>
                  <div className="flex text-secondary gap-0.5">
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                    <Star size={12} fill="currentColor" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white/50"
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* Promotions Section */}
      <section id="promos" className="py-20 max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl text-secondary mb-2 tracking-widest">OFERTAS Y PROMOS</h2>
            <p className="text-white/50 text-xs font-bold uppercase tracking-widest">Lo mejor al mejor precio</p>
          </div>
          <Flame size={40} className="text-secondary opacity-50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredPromos.map((promo, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className={`${promo.color} ${promo.text} p-10 rounded-2xl flex flex-col justify-center text-center relative overflow-hidden group h-64 shadow-2xl border-2 border-white/5`}
            >
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-4 block">🔥 {promo.title}</span>
                <h3 className="text-4xl mb-4 font-black">{promo.subtitle}</h3>
                <p className="text-sm font-bold opacity-70 mb-8">{promo.desc}</p>
                <a 
                  href="https://wa.me/932350348" 
                  className={`inline-flex items-center gap-2 font-black text-[10px] uppercase tracking-widest py-3 px-6 rounded-full transition-all hover:scale-105 active:scale-95 ${promo.color === 'bg-secondary' ? 'bg-dark text-white' : 'bg-white text-dark'}`}
                >
                  PEDIR POR WHATSAPP
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 relative overflow-hidden">
        {/* Sidebar-like layout on desktop within section */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Navigation Sidebar (Desktop Only) */}
          <aside className="hidden lg:block lg:col-span-3 space-y-2">
            <h4 className="text-secondary text-[10px] font-black uppercase tracking-[0.3em] mb-6">Categorías</h4>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all border ${
                  activeCategory === cat.id 
                    ? 'bg-primary border-primary text-white shadow-xl shadow-primary/20' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
            
            <div className="about-us mt-12 p-6 bg-white/5 rounded-2xl text-xs text-white/40 leading-relaxed border border-white/5">
              <p className="font-bold text-white/60 mb-2 uppercase tracking-widest">Tradición Abancay</p>
              Pollo a la brasa con leña seleccionada y las mejores papas peruanas de cosecha local.
            </div>
          </aside>

          <div className="lg:col-span-9">
            <div className="mb-12">
              <h2 className="text-5xl text-white mb-2 tracking-tighter">NUESTRA CARTA</h2>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest leading-relaxed max-w-md">
                Elige tu favorito y nosotros nos encargamos del resto. ¡Sabor dorado garantizado!
              </p>
            </div>

            {/* Mobile Categories Scroll */}
            <div className="lg:hidden flex overflow-x-auto gap-2 pb-6 mb-8 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-xl font-black text-[10px] uppercase tracking-widest whitespace-nowrap border-2 ${
                    activeCategory === cat.id 
                      ? 'bg-primary border-primary text-white' 
                      : 'bg-white/5 border-white/10 text-white/60'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                  <FoodCard key={product.id} product={product} onAdd={handleAddClick} />
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-dark/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-secondary text-[10px] font-black uppercase tracking-[0.4em] mb-4">Validación Social</h2>
            <h3 className="text-4xl text-white font-black uppercase">Lo que dicen en Abancay</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REVIEWS.map((review) => (
              <motion.div 
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/5 border border-white/10 p-8 rounded-3xl"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img src={review.avatar} alt={review.userName} className="w-12 h-12 rounded-full border-2 border-primary" />
                  <div>
                    <h4 className="text-white font-bold">{review.userName}</h4>
                    <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">{review.date}</p>
                  </div>
                </div>
                <div className="flex text-secondary mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed italic italic">"{review.comment}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats/Badges Section */}
      <div className="py-12 bg-accent text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
           {[
             { icon: <Flame />, text: "Brasa al carbón", sub: "100% Auténtico" },
             { icon: <Award />, text: "Premio Local", sub: "Mejor Sabor 2024" },
             { icon: <Clock />, text: "Envío Rápido", sub: "Menos de 30 min" },
             { icon: <MapPin />, text: "Abancay Central", sub: "Jr. Arequipa" },
           ].map((item, idx) => (
             <div key={idx} className="flex flex-col items-center text-center gap-3">
                <div className="text-secondary text-3xl">{item.icon}</div>
                <div>
                  <p className="font-display font-black text-sm uppercase tracking-wider">{item.text}</p>
                  <p className="text-[10px] opacity-60 font-bold uppercase">{item.sub}</p>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* About Section */}
      <section id="nosotros" className="py-24 max-w-7xl mx-auto px-6 overflow-hidden">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-2 md:order-1"
          >
            <div className="w-16 h-2 bg-primary mb-8 rounded-full" />
            <h2 className="text-5xl text-accent mb-8 leading-none">TRADICIÓN Y PASIÓN EN CADA BRASA</h2>
            <div className="space-y-6 text-gray-600 font-medium leading-relaxed">
              <p>
                En <strong>El Sabor Dorado</strong>, no solo cocinamos pollo; creamos momentos de felicidad. Nuestra historia comenzó en Abancay con un sueño simple: ofrecer el mejor pollo a la brasa de la región.
              </p>
              <p>
                Utilizamos carbón de algarrobo seleccionado para un ahumado perfecto, y nuestro marinado secreto de 48 horas garantiza que cada fibra del pollo esté llena de sabor.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-6">
                <div>
                  <h4 className="text-3xl text-primary mb-1 tracking-tighter">100%</h4>
                  <p className="text-xs font-bold text-accent uppercase tracking-widest leading-tight">Papas Andinas Naturales</p>
                </div>
                <div>
                  <h4 className="text-3xl text-primary mb-1 tracking-tighter">+10</h4>
                  <p className="text-xs font-bold text-accent uppercase tracking-widest leading-tight">Años de Tradición</p>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div 
             initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
             whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
             viewport={{ once: true }}
             className="relative order-1 md:order-2"
          >
            <div className="aspect-square rounded-[60px] overflow-hidden rotate-3 shadow-2xl relative z-10">
              <img 
                src="https://res.cloudinary.com/dcnynnstm/image/upload/q_auto/f_auto/v1776439586/EL_SABOR_DORADO_np4awi.jpg" 
                alt="Nosotros - Local El Sabor Dorado" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Design Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary rounded-full -z-0 animate-pulse" />
            <div className="absolute -bottom-6 -left-6 w-48 h-48 border-[12px] border-primary/20 rounded-full -z-0" />
          </motion.div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-accent py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
           <h2 className="text-white text-4xl mb-6">VISÍTANOS EN ABANCAY</h2>
           <p className="text-white/60 mb-12 max-w-md mx-auto font-medium">
             Estamos ubicados en el corazón de la ciudad. 
             ¡Te esperamos con el pollo recién salidito!
           </p>
           <a 
            href="https://maps.app.goo.gl/fYnnE4keHh9rD46S7"
            target="_blank"
            className="inline-flex items-center gap-3 bg-secondary text-accent px-10 py-5 rounded-3xl font-black text-lg hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-secondary/10"
           >
             <MapPin size={24} />
             VER UBICACIÓN EN GOOGLE MAPS
           </a>
        </div>
      </section>

      <footer className="footer-actions bg-black/80 py-10 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8 py-10">
          <div className="text-white/50 text-xs font-bold uppercase tracking-widest">
            © 2024 POLLERÍA EL SABOR DORADO - TODOS LOS DERECHOS RESERVADOS
          </div>
          
          <a 
            href="https://wa.me/932350348?text=Hola,%20quiero%20hacer%20un%20pedido" 
            className="flex items-center gap-4 bg-success text-white px-8 py-4 rounded-full font-black text-sm transition-all hover:scale-105 active:scale-95 shadow-xl shadow-success/20"
          >
            <span className="bg-white/20 p-2 rounded-full">
              <Phone size={16} />
            </span>
            <div className="text-left leading-none">
              <p className="text-[10px] opacity-70 mb-0.5">PEDIDO POR WHATSAPP</p>
              <p className="text-base tracking-widest">932 350 348</p>
            </div>
          </a>
        </div>
      </footer>

      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/932350348?text=Hola,%20quiero%20hacer%20un%20pedido%20de%20la%20pollería" 
        target="_blank" 
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-90 shadow-[#25D366]/30 border-4 border-white sm:hidden lg:flex"
      >
        <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>

      {/* AI Assistant */}
      <ChatAssistant onAddToCart={handleAddClick} />

      {/* Customization Modal */}
      <AnimatePresence>
        {customizingProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setCustomizingProduct(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 50 }}
              className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-6 sm:p-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-dark uppercase">{customizingProduct.name}</h3>
                  <p className="text-primary font-bold">Personaliza tu gusto</p>
                </div>
                <button 
                  onClick={() => setCustomizingProduct(null)}
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 hover:text-dark transition-all"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-8">
                {/* Guarnición */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-black uppercase text-accent/60 mb-4 tracking-[0.2em]">
                    <Utensils size={14} /> Guarnición Principal
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Papas Fritas', 'Arroz Chaufa'].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => setSelectedGuarnicion(opt)}
                        className={`px-4 py-4 rounded-2xl font-bold text-sm transition-all border-2 ${
                          selectedGuarnicion === opt 
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                            : 'bg-white border-gray-100 text-dark hover:border-gray-200'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ensalada */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-black uppercase text-accent/60 mb-4 tracking-[0.2em]">
                    <Flame size={14} /> Tipo de Ensalada
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Frescas', 'Cocidas', 'Sin Ensalada'].map(opt => (
                      <button 
                        key={opt}
                        onClick={() => setSelectedEnsalada(opt)}
                        className={`px-4 py-4 rounded-2xl font-bold text-sm transition-all border-2 ${
                          selectedEnsalada === opt 
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                            : 'bg-white border-gray-100 text-dark hover:border-gray-200'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cremas */}
                <div>
                  <label className="flex items-center gap-2 text-xs font-black uppercase text-accent/60 mb-4 tracking-[0.2em]">
                    <Star size={14} /> Selecciona tus Cremas
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Mayonesa', 'Mostaza', 'Ketchup', 'Ají', 'Pollero', 'Chimichurri'].map(crema => (
                      <button 
                        key={crema}
                        onClick={() => toggleCrema(crema)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border-2 ${
                          selectedCremas.includes(crema)
                            ? 'bg-secondary border-secondary text-accent shadow-md'
                            : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                        }`}
                      >
                        {selectedCremas.includes(crema) && '✓ '} {crema}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-10 pt-6 border-t border-gray-100">
                <button 
                  onClick={() => addToCart(customizingProduct, { 
                    guarnicion: selectedGuarnicion, 
                    ensalada: selectedEnsalada,
                    cremas: selectedCremas
                  })}
                  className="w-full bg-primary hover:bg-red-700 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <ShoppingCart size={18} />
                  Confirmar y Añadir
                </button>
                <p className="text-center text-[10px] text-gray-400 mt-4 font-bold uppercase tracking-widest">
                  Total: S/{customizingProduct.price.toFixed(2)}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sticky Cart FAB */}
      {cart.length > 0 && (
        <button 
          onClick={() => setIsCartOpen(!isCartOpen)}
          className="fixed bottom-6 left-6 z-50 bg-primary text-white w-20 h-20 rounded-full shadow-2xl flex flex-col items-center justify-center border-4 border-white transition-all hover:scale-110 active:scale-90"
        >
          <ShoppingCart size={24} />
          <span className="text-[10px] font-black">{cart.length} ÍTEMS</span>
        </button>
      )}

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-[110] pointer-events-none">
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="absolute left-0 top-0 bottom-0 w-full max-w-sm bg-white pointer-events-auto shadow-2xl flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-black text-dark uppercase">Tu Carrito</h3>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-dark">Cerrar</button>
              </div>
              
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                <div className="order-type-selector grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => setOrderType('delivery')}
                    className={`py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all flex flex-col items-center gap-1 ${
                      orderType === 'delivery' 
                        ? 'bg-primary border-primary text-white shadow-lg' 
                        : 'bg-white border-gray-100 text-gray-400'
                    }`}
                  >
                    <span>🛵 Delivery</span>
                  </button>
                  <button 
                    onClick={() => setOrderType('local')}
                    className={`py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border-2 transition-all flex flex-col items-center gap-1 ${
                      orderType === 'local' 
                        ? 'bg-primary border-primary text-white shadow-lg' 
                        : 'bg-white border-gray-100 text-gray-400'
                    }`}
                  >
                    <span>🍗 Local / Recojo</span>
                  </button>
                </div>

                {/* Customer Data Fields */}
                <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <h4 className="text-[10px] font-black text-accent/60 uppercase tracking-[0.2em] mb-2">Datos de Entrega</h4>
                  <input 
                    type="text" 
                    placeholder="Tu Nombre" 
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-dark focus:outline-none focus:ring-1 focus:ring-primary/20"
                  />
                  <input 
                    type="tel" 
                    placeholder="Celular de Contacto" 
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-dark focus:outline-none focus:ring-1 focus:ring-primary/20"
                  />
                  {orderType === 'delivery' && (
                    <input 
                      type="text" 
                      placeholder="Dirección Exacta (Abancay)" 
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-xs text-dark focus:outline-none focus:ring-1 focus:ring-primary/20 animate-in fade-in slide-in-from-top-2"
                    />
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-accent/60 uppercase tracking-[0.2em]">Tu Pedido</h4>
                  {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-start border-b border-gray-50 pb-4">
                    <div>
                      <h4 className="font-black text-dark text-sm uppercase">{item.name}</h4>
                      {item.customizations && (
                        <p className="text-[10px] text-gray-400 font-bold uppercase">
                          {item.customizations.guarnicion} | {item.customizations.ensalada}
                        </p>
                      )}
                      <p className="text-xs font-bold text-primary mt-1">S/{item.price.toFixed(2)}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-[10px] font-black text-red-400 uppercase">Quitar</button>
                  </div>
                ))}
                </div>
                {cart.length === 0 && <p className="text-center text-gray-400 py-10 text-xs">Tu carrito está vacío</p>}
                
                {/* Upselling Section */}
                {cart.length > 0 && (
                  <div className="upsell-section border-t border-gray-100 pt-6 mt-6">
                    <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">¿Te falta algo? 😋</h4>
                    <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory">
                      {MENU_PRODUCTS
                        .filter(p => (p.category === 'bebida' || p.category === 'complemento') && !cart.some(item => item.productId === p.id))
                        .slice(0, 6)
                        .map(upsell => (
                          <div key={upsell.id} className="min-w-[150px] flex-shrink-0 bg-gray-50 rounded-2xl p-3 border border-gray-100 flex flex-col justify-between snap-start">
                            <div>
                              <img src={upsell.image} alt={upsell.name} className="w-full h-20 object-cover rounded-xl mb-2" referrerPolicy="no-referrer" />
                              <h5 className="text-[10px] font-black text-dark truncate uppercase">{upsell.name}</h5>
                              <p className="text-[10px] text-primary font-bold">S/{upsell.price.toFixed(2)}</p>
                            </div>
                            <button 
                              onClick={() => addToCart(upsell)}
                              className="mt-2 w-full py-2 bg-white border border-gray-200 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-sm"
                            >
                              + Añadir
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100">
                <div className="flex justify-between mb-4">
                  <span className="font-black text-dark uppercase text-sm">Total</span>
                  <span className="font-black text-primary text-xl">S/{totalCart.toFixed(2)}</span>
                </div>
                <button 
                  onClick={sendWhatsAppOrder}
                  disabled={cart.length === 0}
                  className="w-full bg-success hover:bg-green-600 text-white py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-success/20 disabled:opacity-50"
                >
                  REALIZAR PEDIDO (WHATSAPP)
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
