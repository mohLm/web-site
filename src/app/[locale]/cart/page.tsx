'use client'

import { useCart } from '@/context/CartContext';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from '@/navigation';

export default function CartPage() {
  const t = useTranslations('Menu');
  const ct = useTranslations('Checkout');
  const { cart, removeFromCart, totalItems, clearCart } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const totalPrice = cart.reduce((acc, item) => {
    const priceNum = parseInt(item.price.replace(/\D/g, '')) || 0;
    return acc + (priceNum * item.quantity);
  }, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    
    const restaurantPhone = "213555123456"; // Algiers restaurant phone
    let message = `*NEW ORDER - YAMATO DZ*%0A%0A`;
    message += `*Customer:* ${name}%0A`;
    message += `*Phone:* ${phone}%0A%0A`;
    message += `*Items:*%0A`;
    
    cart.forEach(item => {
      message += `- ${item.name} (x${item.quantity}) - ${item.price}%0A`;
    });
    
    message += `%0A*Total:* ${totalPrice} DZ`;
    
    const whatsappUrl = `https://wa.me/${restaurantPhone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
    clearCart();
  };

  if (totalItems === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center min-h-[60vh] py-32">
        <div className="serif italic text-[3rem] text-primary opacity-20 mb-6">大和</div>
        <h1 className="text-2xl font-bold tracking-tight mb-8">Your Cart is Empty</h1>
        <Link href="/menu" className="btn-primary">
          Explore Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page pb-24">
      <section className="bg-secondary section-padding pt-32 pb-16 text-center">
        <div className="container">
          <h1 className="text-5xl md:text-7xl mb-8 serif italic">{t('cart')}</h1>
          <div className="sumi-e-accent mx-auto"></div>
        </div>
      </section>

      <section className="container mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Item List */}
          <div className="space-y-8">
            <h2 className="text-xl uppercase tracking-widest font-bold">Your Selection</h2>
            {cart.map((item) => (
              <motion.div 
                layout
                key={item.id}
                className="flex justify-between items-center p-6 border-b border-border group"

              >
                <div>
                  <h4 className="text-lg font-bold tracking-tight">{item.name}</h4>
                  <p className="text-xs text-muted uppercase tracking-widest mt-1">
                    {item.price} x {item.quantity}
                  </p>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-xs font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all"
                >
                  Remove
                </button>
              </motion.div>
            ))}
            <div className="pt-6 mt-4 flex justify-between items-end border-t border-border">
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.3em] text-muted">Total</span>
              <span className="text-3xl serif italic text-primary">{totalPrice} DZ</span>
            </div>
          </div>

          <div className="zen-border p-10 h-fit" style={{ background: 'white' }}>
            <h2 className="text-lg uppercase tracking-widest font-bold mb-10 pb-4 border-b border-border">Checkout details</h2>
            <form onSubmit={handleCheckout} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[0.6rem] uppercase tracking-[0.3em] font-bold text-muted">Name</label>
                <input 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent border-b border-border py-4 focus:border-primary outline-none transition-all serif italic text-xl" 
                  placeholder="Kenji Tanaka"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-[0.6rem] uppercase tracking-[0.3em] font-bold text-muted">Phone Number</label>
                <input 
                  required 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-transparent border-b border-border py-4 focus:border-primary outline-none transition-all serif italic text-xl" 
                  placeholder="+213 555..."
                />
              </div>

              <button type="submit" className="btn-primary w-full mt-8">
                Confirm via WhatsApp
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
