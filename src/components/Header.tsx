'use client'

import { Link, usePathname } from '@/navigation'
import { useTranslations } from 'next-intl'
import LocaleSwitcher from './LocaleSwitcher'
import { useState, useEffect } from 'react'
import { useCart } from '@/context/CartContext'

export default function Header() {
  const t = useTranslations('Nav')
  const { totalItems } = useCart()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: t('menu') },
    { href: '/reservations', label: t('reservations') },
  ]

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: 'all 0.7s ease',
          background: isScrolled ? 'rgba(255,255,255,0.95)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
          padding: isScrolled ? '0.5rem 0' : '1.5rem 0',
          borderBottom: isScrolled ? '1px solid var(--color-border)' : 'none',
        }}
      >
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo Placeholder */}
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              border: '2px dashed var(--color-primary)', 
              padding: '10px 20px', 
              borderRadius: '8px',
              backgroundColor: 'rgba(255,255,255,0.5)'
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-display)'}}>YAMATO LOGO</span>
              <span style={{ fontSize: '0.5rem', color: 'var(--color-muted)', fontWeight: 600}}>(Insert Logo Image Here)</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden-mobile">
            {navLinks.map(link => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    textDecoration: 'none',
                    color: isActive ? 'var(--color-primary)' : 'var(--color-foreground)',
                    borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                    paddingBottom: '2px',
                    transition: 'all 0.3s ease',
                    fontFamily: 'var(--font-sans)',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--color-primary)' }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--color-foreground)' }}
                >
                  {link.label}
                </Link>
              )
            })}

            {/* Cart */}
            <Link href="/cart" style={{ position: 'relative', textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.3em',
                  color: 'var(--color-foreground)',
                  transition: 'color 0.3s ease',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-primary)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-foreground)')}
              >
                {t('menu') === 'Menu' ? 'Cart' : t('cart' as never) || 'Cart'}
              </span>
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -8,
                  right: -12,
                  background: 'var(--color-primary)',
                  color: 'white',
                  fontSize: '0.5rem',
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                }}>
                  {totalItems}
                </span>
              )}
            </Link>

            <LocaleSwitcher />
          </nav>

          {/* Mobile: Cart badge + Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }} className="show-mobile">
            <Link href="/cart" style={{ position: 'relative', textDecoration: 'none' }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', color: 'var(--color-foreground)' }}>
                Cart
              </span>
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute',
                  top: -8,
                  right: -12,
                  background: 'var(--color-primary)',
                  color: 'white',
                  fontSize: '0.5rem',
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                }}>
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              id="hamburger-btn"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
                padding: '4px',
              }}
            >
              <span style={{ display: 'block', width: 22, height: 1.5, background: 'var(--color-foreground)', transition: 'all 0.3s' }} />
              <span style={{ display: 'block', width: 14, height: 1.5, background: 'var(--color-foreground)', transition: 'all 0.3s' }} />
              <span style={{ display: 'block', width: 18, height: 1.5, background: 'var(--color-foreground)', transition: 'all 0.3s' }} />
            </button>
          </div>
        </div>

        <style>{`
          @media (min-width: 640px) {
            .hidden-mobile { display: flex !important; }
            .show-mobile   { display: none !important; }
          }
          @media (max-width: 639px) {
            .hidden-mobile { display: none !important; }
            .show-mobile   { display: flex !important; }
          }
        `}</style>
      </header>

      {/* ── Mobile Drawer Overlay ───────────────────────────── */}
      <div
        className={`mobile-menu-overlay ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* ── Mobile Drawer ───────────────────────────────────── */}
      <div className={`mobile-menu-drawer ${menuOpen ? 'open' : ''}`}>
        {/* Close Button */}
        <button
          id="drawer-close-btn"
          onClick={() => setMenuOpen(false)}
          aria-label="Close menu"
          style={{
            alignSelf: 'flex-end',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.5rem',
            color: 'var(--color-muted)',
            lineHeight: 1,
            marginBottom: '2rem',
          }}
        >
          ✕
        </button>

        {/* Brand */}
        <div style={{ marginBottom: '3rem' }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: '2rem', fontWeight: 900, color: 'var(--color-primary)', opacity: 0.25 }}>
            大和
          </div>
          <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.5em', textTransform: 'uppercase', marginTop: 4 }}>
            Yamato Dz
          </p>
        </div>

        {/* Links */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', flex: 1 }}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.4em',
                textDecoration: 'none',
                color: 'var(--color-foreground)',
                transition: 'color 0.3s',
                borderBottom: '1px solid var(--color-border)',
                paddingBottom: '1rem',
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Bottom locale switcher */}
        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)' }}>
          <LocaleSwitcher />
        </div>
      </div>
    </>
  )
}
