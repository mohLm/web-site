'use client'

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import YamatoLogo from '@/components/YamatoLogo';

export default function AboutPage() {
  const t = useTranslations('About');
  const nt = useTranslations('Nav');

  // We fall back to English if the translation files don't have the About section yet
  // but we should Ideally update messages/en.json right after this.

  return (
    <div className="pb-24">
      {/* ── HEADER ──────────────────────────────────────────── */}
      <section className="bg-secondary pt-40 pb-20 text-center border-b border-border">
        <div className="container relative">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="serif italic text-[5rem] text-primary opacity-10 leading-none mb-[-2.5rem] select-none pointer-events-none absolute left-1/2 -translate-x-1/2 top-4">
              物語
            </div>
            <h1 className="text-5xl md:text-7xl mb-6 serif italic relative z-10">
              {nt('about')}
            </h1>
            <div className="sumi-e-accent mx-auto" />
          </motion.div>
        </div>
      </section>

      {/* ── STORY SECTION ───────────────────────────────────── */}
      <section className="container mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-xs font-bold mb-6 uppercase tracking-[0.4em] text-muted">
              {t('heritage_label') || "Our Heritage"}
            </h2>
            <h3 className="text-3xl font-serif italic mb-8 leading-tight">
              {t('heritage_title') || "A bridge between Tokyo & Algiers."}
            </h3>
            <div className="space-y-6 text-muted text-sm leading-relaxed">
              <p>
                {t('heritage_p1') || "Yamato Dz was born from a profound respect for the age-old traditions of Japanese culinary arts. Our journey began with a single mission: to bring the authentic, uncompromised taste of Japan to the vibrant streets of Algiers."}
              </p>
              <p>
                {t('heritage_p2') || "Every ingredient is chosen with meticulous care. Every technique reflects centuries of mastery. From the pristine cuts of our sashimi to the complex, 24-hour broths of our ramen, we serve harmony on a plate."}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="zen-border p-12 bg-white flex flex-col items-center justify-center text-center aspect-square card-lift"
          >
            <div className="mb-8 opacity-40 mix-blend-multiply w-32 h-32 flex items-center justify-center">
              <YamatoLogo showText={false} />
            </div>
            <p className="font-serif italic text-xl text-primary leading-relaxed">
              "Perfection is not when there is no more to add, but when there is no more to take away."
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── VALUES GRID ───────────────────────────────────── */}
      <section className="bg-secondary mt-32 py-24 border-y border-border">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-xs font-bold mb-6 uppercase tracking-[0.4em] text-muted">
              Philosophy
            </h2>
            <h3 className="text-3xl font-serif italic">The Art of Zen</h3>
            <div className="sumi-e-accent mx-auto mt-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '一', title: 'Quality', desc: 'Sourcing only the finest, freshest ingredients available daily.' },
              { num: '二', title: 'Mastery', desc: 'Executing time-honored techniques with absolute precision.' },
              { num: '三', title: 'Omotenashi', desc: 'Offering hospitality from the heart, anticipating every need.' }
            ].map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="bg-white zen-border p-10 text-center card-lift group"
              >
                <div className="text-4xl font-serif text-primary opacity-20 mb-6 group-hover:opacity-100 transition-opacity duration-500">
                  {v.num}
                </div>
                <h4 className="text-sm font-bold uppercase tracking-widest mb-4">
                  {v.title}
                </h4>
                <p className="text-xs leading-relaxed text-muted">
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
