'use client'

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useCart } from '@/context/CartContext';
import { Link } from '@/navigation';

const CATEGORIES = ['Les Maki', 'Hossomaki', 'Nigiri', 'Onigiri'];

const PLACEHOLDER_ITEMS = [
  { id: '1', name: 'Maki Saumon', category: 'Les Maki', price: '800 DA', description: 'Fresh salmon wrapped in premium sushi rice and toasted seaweed.' },
  { id: '2', name: 'Maki Thon', category: 'Les Maki', price: '900 DA', description: 'Bluefin tuna, sushi rice, and nori roll.' },
  { id: '3', name: 'Chicken Cheese', category: 'Les Maki', price: '700 DA', description: 'Crispy chicken roll with cream cheese.' },
  { id: '4', name: 'Hosomaki Concombre', category: 'Hossomaki', price: '450 DA', description: 'Thinly rolled cucumber maki.' },
  { id: '5', name: 'Hosomaki Avocat', category: 'Hossomaki', price: '500 DA', description: 'Creamy avocado simple roll.' },
  { id: '6', name: 'Nigiri Saumon', category: 'Nigiri', price: '150 DA', description: 'Slice of raw salmon over pressed sushi rice.' },
  { id: '7', name: 'Nigiri Crevette', category: 'Nigiri', price: '180 DA', description: 'Cooked shrimp served gracefully over rice.' },
  { id: '8', name: 'Onigiri Poulet', category: 'Onigiri', price: '350 DA', description: 'Triangular rice ball stuffed with seasoned chicken.' },
];

function SkeletonCard() {
  return (
    <div className="zen-border" style={{ padding: '2rem', background: 'rgba(255,255,255,0.7)' }}>
      <div className="skeleton" style={{ width: '100%', aspectRatio: '4/3', marginBottom: '1.5rem' }} />
      <div className="skeleton" style={{ width: '55%', height: 18 }} />
    </div>
  );
}

export default function MenuPage() {
  const t = useTranslations('Menu');
  const { cart, addToCart, updateQuantity } = useCart();
  const [menuItems, setMenuItems] = useState<typeof PLACEHOLDER_ITEMS>([]);
  const [loading, setLoading] = useState(true);
  
  // Track the currently expanded item ID
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, 'menu_items'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as typeof PLACEHOLDER_ITEMS[0]));
        setMenuItems(items);
      } catch {
        // Firestore not configured yet — show placeholder data
        setMenuItems(PLACEHOLDER_ITEMS);
      }
      setLoading(false);
    };
    fetchMenu();
  }, []);

  const handleCardClick = (id: string) => {
    // Toggle the expanded state
    setExpandedItemId(prev => (prev === id ? null : id));
  };

  const handleAddToCart = (e: React.MouseEvent, item: typeof PLACEHOLDER_ITEMS[0]) => {
    e.stopPropagation(); // prevent collapsing the card when clicking Add to Cart
    addToCart({ ...item, price: item.price.replace(' ', '') });
    // Keep it expanded so the user sees it feedback (or could collapse it)
  };

  // Extract unique categories from menuItems, keeping fallback order if present
  const dynamicCategories = Array.from(new Set(menuItems.map(item => item.category)));
  // Sort so that if they match the original Categories, they stay in order, but it's simpler to just use dynamicCategories.
  const categoriesToRender = dynamicCategories.length > 0 ? dynamicCategories : CATEGORIES;

  return (
    <div style={{ paddingBottom: '6rem' }}>

      {/* ── Header ──────────────────────────────────────────── */}
      <section
        style={{
          paddingTop: '8rem',
          paddingBottom: '2rem',
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <div className="container relative">
          <motion.h1
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="category-title"
            style={{ fontSize: '3rem', marginBottom: '1.5rem' }}
          >
            {t('title') === 'Menu' ? 'Le Menu' : t('title')}
          </motion.h1>
          <div className="sumi-e-accent" style={{ marginBottom: '3rem' }} />

          {/* Floating Cart Button for Menu Page */}
          <Link href="/cart"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              padding: '0.75rem 1.2rem',
              borderRadius: '50px',
              textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(206, 18, 38, 0.3)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              zIndex: 40
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(206, 18, 38, 0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(206, 18, 38, 0.3)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, fontFamily: 'var(--font-sans)', letterSpacing: '0.1em' }}>
              {useCart().totalItems} Items
            </span>
          </Link>
        </div>
      </section>

      {/* ── Categorized Menu List ────────────────────────────────────────────── */}
      <section className="container">
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
            {categoriesToRender.map(category => {
              // Hide unavailable items
              const categoryItems = menuItems.filter(item => item.category === category && item.available !== false);
              if (categoryItems.length === 0) return null;

              return (
                <div key={category} id={category.toLowerCase().replace(' ', '-')}>
                  <h2 className="category-title" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>{category}</h2>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    <AnimatePresence>
                      {categoryItems.map(item => {
                        const isExpanded = expandedItemId === item.id;

                        return (
                          <motion.div
                            layout
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="zen-border group"
                            onClick={() => handleCardClick(item.id)}
                            style={{ 
                              background: 'rgba(255, 255, 255, 0.85)', 
                              backdropFilter: 'blur(10px)',
                              padding: '1.5rem', 
                              cursor: 'pointer',
                              borderRadius: '8px',
                              border: isExpanded ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                              position: 'relative',
                              overflow: 'hidden'
                            }}
                          >
                            {/* Plate / Image Area */}
                            {'imageUrl' in item && item.imageUrl ? (
                              <div style={{ position: 'relative', aspectRatio: '4/3', marginBottom: '1rem', overflow: 'hidden', borderRadius: '4px' }}>
                                <img
                                  src={(item as { imageUrl: string }).imageUrl}
                                  alt={item.name}
                                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                              </div>
                            ) : (
                              <div
                                style={{
                                  aspectRatio: '4/3',
                                  marginBottom: '1rem',
                                  background: 'var(--color-secondary)',
                                  borderRadius: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontFamily: 'var(--font-display)',
                                  fontSize: '2rem',
                                  color: 'var(--color-primary)',
                                  opacity: 0.2,
                                }}
                              >
                                {category.split(' ')[0][0]} {/* Just an initial letter from the category */}
                              </div>
                            )}

                            {/* Item Header with Name and Price */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                              <h3
                                style={{
                                  fontSize: '1.1rem',
                                  fontWeight: 700,
                                  fontFamily: 'var(--font-sans)',
                                  color: isExpanded ? 'var(--color-primary)' : 'var(--color-foreground)',
                                  transition: 'color 0.3s',
                                  paddingRight: '1rem'
                                }}
                              >
                                {item.name}
                              </h3>
                              <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary)', whiteSpace: 'nowrap' }}>
                                {item.price}
                              </span>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                              <span style={{ color: 'var(--color-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700 }}>
                                {isExpanded ? 'Hide Details' : 'View Details'}
                              </span>
                              <span style={{ color: 'var(--color-muted)', fontSize: '1rem', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
                                ▾
                              </span>
                            </div>

                            {/* Expanded Area (Description ONLY) */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  style={{ overflow: 'hidden' }}
                                >
                                  <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.6, paddingBottom: '1rem' }}>
                                    {item.description}
                                  </p>
                                </motion.div>
                              )}
                            </AnimatePresence>
                            
                            {/* ALWAYS VISIBLE Buttons (Add to Cart / Quantity) */}
                            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                              {(() => {
                                const cartItem = cart.find(i => i.id === item.id);
                                const quantity = cartItem ? cartItem.quantity : 0;
                                
                                return (
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: quantity > 0 ? 'rgba(206, 18, 38, 0.05)' : 'white', padding: '0.4rem', borderRadius: '8px', border: quantity > 0 ? '1px solid rgba(206, 18, 38, 0.2)' : '1px solid var(--color-border)' }}>
                                    <button
                                      onClick={(e) => { 
                                        e.stopPropagation(); 
                                        if (quantity > 0) updateQuantity(item.id, quantity - 1); 
                                      }}
                                      style={{
                                        width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: quantity > 0 ? 'white' : 'var(--color-secondary)', border: '1px solid var(--color-border)', borderRadius: '6px', cursor: quantity > 0 ? 'pointer' : 'default',
                                        fontWeight: 'bold', fontSize: '1.2rem', color: quantity > 0 ? 'var(--color-primary)' : 'var(--color-muted)', transition: 'all 0.2s',
                                        opacity: quantity > 0 ? 1 : 0.5
                                      }}
                                      onMouseDown={e => { if (quantity > 0) e.currentTarget.style.transform = 'scale(0.95)'; }}
                                      onMouseUp={e => { if (quantity > 0) e.currentTarget.style.transform = 'scale(1)'; }}
                                      onMouseLeave={e => { if (quantity > 0) e.currentTarget.style.transform = 'scale(1)'; }}
                                    >-</button>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: quantity === 0 ? 'pointer' : 'default' }}
                                         onClick={(e) => { 
                                           if (quantity === 0) { e.stopPropagation(); addToCart({ ...item, price: item.price.replace(' ', '') }) } 
                                         }}
                                    >
                                      <span style={{ fontWeight: 800, fontFamily: 'var(--font-sans)', fontSize: '1.2rem', color: quantity > 0 ? 'var(--color-primary)' : 'var(--color-foreground)' }}>
                                        {quantity > 0 ? quantity : t('add_to_cart') === 'Menu.add_to_cart' ? 'ADD' : t('add_to_cart')}
                                      </span>
                                      {quantity > 0 && (
                                        <span style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.6, color: 'var(--color-primary)' }}>
                                          in cart
                                        </span>
                                      )}
                                    </div>

                                    <button
                                      onClick={(e) => { 
                                        e.stopPropagation(); 
                                        if (quantity === 0) {
                                          addToCart({ ...item, price: item.price.replace(' ', '') });
                                        } else {
                                          updateQuantity(item.id, quantity + 1); 
                                        }
                                      }}
                                      style={{
                                        width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: 'var(--color-primary)', border: 'none', borderRadius: '6px', cursor: 'pointer',
                                        fontWeight: 'bold', fontSize: '1.2rem', color: 'white', transition: 'all 0.2s'
                                      }}
                                      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
                                      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                    >+</button>
                                  </div>
                                );
                              })()}
                            </div>

                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
