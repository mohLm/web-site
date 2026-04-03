'use client'

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { useCart } from '@/context/CartContext';

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
  const { addToCart } = useCart();
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
        setMenuItems(items.length > 0 ? items : PLACEHOLDER_ITEMS);
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

  return (
    <div style={{ paddingBottom: '6rem' }}>

      {/* ── Header ──────────────────────────────────────────── */}
      <section
        style={{
          paddingTop: '8rem',
          paddingBottom: '2rem',
          textAlign: 'center',
        }}
      >
        <div className="container">
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
            {CATEGORIES.map(category => {
              const categoryItems = menuItems.filter(item => item.category === category);
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

                            {/* Item Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <h3
                                style={{
                                  fontSize: '1.1rem',
                                  fontWeight: 700,
                                  fontFamily: 'var(--font-sans)',
                                  color: isExpanded ? 'var(--color-primary)' : 'var(--color-foreground)',
                                  transition: 'color 0.3s',
                                }}
                              >
                                {item.name}
                              </h3>
                              
                              {/* Small chevron or indicator to show it's clickable */}
                              <span style={{ color: 'var(--color-muted)', fontSize: '1.2rem', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
                                ▾
                              </span>
                            </div>

                            {/* Expanded Area (Price + Desc + Order Button) */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                  animate={{ height: 'auto', opacity: 1, marginTop: '1rem' }}
                                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                  style={{ overflow: 'hidden' }}
                                >
                                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                      <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.6, flex: 1, paddingRight: '1rem' }}>
                                        {item.description}
                                      </p>
                                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-primary)', whiteSpace: 'nowrap' }}>
                                        {item.price}
                                      </span>
                                    </div>

                                    <button
                                      onClick={(e) => handleAddToCart(e, item)}
                                      style={{
                                        width: '100%',
                                        background: 'var(--color-primary)',
                                        color: 'white',
                                        border: 'none',
                                        padding: '0.75rem',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        fontWeight: 700,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.2em',
                                        cursor: 'pointer',
                                        fontFamily: 'var(--font-sans)',
                                        transition: 'background 0.3s, transform 0.1s',
                                      }}
                                      onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
                                      onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                                    >
                                      {t('add_to_cart') === 'Menu.add_to_cart' ? 'Order' : t('add_to_cart')}
                                    </button>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

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
