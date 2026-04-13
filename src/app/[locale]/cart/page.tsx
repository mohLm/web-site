'use client'

import { useCart } from '@/context/CartContext';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Link } from '@/navigation';

export default function CartPage() {
  const t = useTranslations('Menu');
  const ct = useTranslations('Checkout');
  const { cart, removeFromCart, updateQuantity, totalItems, clearCart } = useCart();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalPrice = cart.reduce((acc, item) => {
    const priceNum = parseInt(item.price.replace(/\D/g, '')) || 0;
    return acc + (priceNum * item.quantity);
  }, 0);

  if (!mounted) return null;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const orderData = {
        customerName: name,
        customerPhone: phone,
        items: cart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
        totalPrice: totalPrice,
        status: 'pending',
        createdAt: new Date().toISOString()
      };
      
      // Save to Firebase
      await addDoc(collection(db, "orders"), orderData);
      
      // Send webhook notification to bot/dashboard
      await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'order', data: orderData })
      }).catch(err => console.log('Notification error', err)); // Non-blocking
      
      setIsSubmitting(false);
      setIsSuccess(true);
      clearCart();
    } catch (error) {
      console.error("Error creating order:", error);
      setIsSubmitting(false);
      alert("Something went wrong. Please try again.");
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center text-center min-h-[60vh] py-32 px-4">
        <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-white p-12 max-w-md w-full border border-border flex flex-col items-center shadow-2xl relative overflow-hidden"
        >
          <div className="serif italic text-[5rem] text-primary opacity-[0.03] absolute top-[-20px] right-[-20px] pointer-events-none">大和</div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-muted mb-2">Yamato Dz</p>
          <h2 className="text-3xl font-bold mb-6 serif italic">Order Received</h2>
          <p className="text-sm text-foreground/70 mb-8 leading-relaxed">
            Thank you, {name}. Your order is currently being prepared by our chefs.
          </p>
          <button onClick={() => setIsSuccess(false)} className="btn-primary w-full shadow-lg">
            Return to Menu
          </button>
        </motion.div>
      </div>
    );
  }

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
                <div className="flex-1">
                  <h4 className="text-lg font-bold tracking-tight">{item.name}</h4>
                  <div className="flex items-center gap-4 mt-2">
                    <p className="text-xs text-muted uppercase tracking-widest font-bold">
                      {item.price}
                    </p>
                    <div className="flex items-center border border-border rounded-full px-2 py-1 bg-white">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center text-muted hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-full"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center text-muted hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-full"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-xs font-bold uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all ml-4"
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

              <button type="submit" disabled={isSubmitting} className="btn-primary w-full mt-8 disabled:opacity-50">
                {isSubmitting ? 'Processing...' : 'Confirm Order'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
