'use client'

import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const RESTAURANT_PHONE = '213555123456';

const GUEST_OPTIONS = ['guests_1', 'guests_2', 'guests_3', 'guests_4', 'guests_5', 'guests_6'] as const;

export default function ReservationsPage() {
  const t = useTranslations('Reservations');

  const [form, setForm] = useState({ name: '', phone: '', date: '', time: '', guests: 'guests_2', notes: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const guestsLabel = t(form.guests as (typeof GUEST_OPTIONS)[number]);
    let message = `*RESERVATION REQUEST — YAMATO DZ*%0A%0A`;
    message += `*Name:* ${form.name}%0A`;
    message += `*Phone:* ${form.phone}%0A`;
    message += `*Date:* ${form.date}%0A`;
    message += `*Time:* ${form.time}%0A`;
    message += `*Guests:* ${guestsLabel}%0A`;
    if (form.notes) message += `*Notes:* ${form.notes}%0A`;

    const url = `https://wa.me/${RESTAURANT_PHONE}?text=${message}`;
    window.open(url, '_blank');

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid var(--color-border)',
    padding: '0.85rem 0',
    fontFamily: 'var(--font-serif)',
    fontStyle: 'italic',
    fontSize: '1.1rem',
    color: 'var(--color-foreground)',
    outline: 'none',
    transition: 'border-color 0.3s ease',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '0.6rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.4em',
    color: 'var(--color-muted)',
    fontFamily: 'var(--font-sans)',
  };

  return (
    <div style={{ paddingBottom: '6rem' }}>

      {/* ── Header ──────────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--color-secondary)',
          paddingTop: '8rem',
          paddingBottom: '4rem',
          textAlign: 'center',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="serif italic"
            style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)', marginBottom: '1.5rem' }}
          >
            {t('title')}
          </motion.h1>
          <div className="sumi-e-accent" />
        </div>
      </section>

      {/* ── Form / Success ───────────────────────────────────── */}
      <section className="container" style={{ marginTop: '4rem', maxWidth: 560 }}>
        <AnimatePresence mode="wait">
          {submitted ? (
            /* Success State */
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                border: '1px solid var(--color-border)',
                background: 'white',
              }}
            >
              <div
                className="serif italic"
                style={{
                  fontSize: '3rem',
                  color: 'var(--color-primary)',
                  opacity: 0.4,
                  marginBottom: '1.5rem',
                }}
              >
                大和
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>
                {t('success_title')}
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-muted)', lineHeight: 1.8 }}>
                {t('success_message')}
              </p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', date: '', time: '', guests: 'guests_2', notes: '' }); }}
                style={{
                  marginTop: '2.5rem',
                  background: 'none',
                  border: '1px solid var(--color-foreground)',
                  padding: '0.75rem 2rem',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.3em',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all 0.3s',
                }}
              >
                New Reservation
              </button>
            </motion.div>
          ) : (
            /* Form */
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.15 }}
              className="zen-border"
              style={{ background: 'white', padding: '3rem 2.5rem' }}
            >
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                {/* Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={labelStyle}>{t('name')}</label>
                  <input
                    required
                    id="res-name"
                    type="text"
                    placeholder="Ex. Kenji Tanaka"
                    value={form.name}
                    onChange={handleChange('name')}
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
                  />
                </div>

                {/* Phone */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={labelStyle}>{t('phone')}</label>
                  <input
                    required
                    id="res-phone"
                    type="tel"
                    placeholder="+213 555..."
                    value={form.phone}
                    onChange={handleChange('phone')}
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
                  />
                </div>

                {/* Date + Time */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={labelStyle}>{t('date')}</label>
                    <input
                      required
                      id="res-date"
                      type="date"
                      value={form.date}
                      onChange={handleChange('date')}
                      min={new Date().toISOString().split('T')[0]}
                      style={{ ...inputStyle, fontFamily: 'var(--font-sans)', fontStyle: 'normal', fontWeight: 600 }}
                      onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
                      onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={labelStyle}>{t('time')}</label>
                    <input
                      required
                      id="res-time"
                      type="time"
                      value={form.time}
                      onChange={handleChange('time')}
                      style={{ ...inputStyle, fontFamily: 'var(--font-sans)', fontStyle: 'normal', fontWeight: 600 }}
                      onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
                      onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
                    />
                  </div>
                </div>

                {/* Guests */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={labelStyle}>{t('guests')}</label>
                  <select
                    id="res-guests"
                    value={form.guests}
                    onChange={handleChange('guests')}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: '1px solid var(--color-border)',
                      padding: '0.85rem 0',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      color: 'var(--color-foreground)',
                      outline: 'none',
                      appearance: 'none',
                      cursor: 'pointer',
                      transition: 'border-color 0.3s',
                    }}
                    onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
                  >
                    {GUEST_OPTIONS.map(key => (
                      <option key={key} value={key}>{t(key)}</option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={labelStyle}>{t('notes')}</label>
                  <textarea
                    id="res-notes"
                    value={form.notes}
                    onChange={handleChange('notes')}
                    rows={3}
                    placeholder="Allergies, birthday, window seat..."
                    style={{
                      ...inputStyle,
                      resize: 'none',
                      borderBottom: 'none',
                      border: '1px solid var(--color-border)',
                      padding: '0.85rem',
                      borderRadius: 0,
                    }}
                    onFocus={e => (e.target.style.borderColor = 'var(--color-primary)')}
                    onBlur={e => (e.target.style.borderColor = 'var(--color-border)')}
                  />
                </div>

                <button
                  id="res-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary"
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  {isSubmitting ? '...' : t('submit')}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}
