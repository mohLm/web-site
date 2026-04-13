'use client'

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/navigation';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: 'easeOut' as const },
});

export default function Home() {
  const t = useTranslations('Index');
  const nt = useTranslations('Nav');

  const categories = [
    { 
      name: 'Les Maki', 
      path: '/menu#les-maki',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuApKTP4OaBjntI3n0IexLpGu76YnORqBNJ5brbLC3XvuzUFtg_f5Od859Nh_5u-vUwxkCjL0Mz6AlY5PoWjuTnxXD0wiiZTmqmdgg6osjh0IEeDQqSVGbzzZ5sukAf3Tla5ICtueExvU2L607SrCxVzNchFlWu1v-FfllDRKlRbTnSMIjxztXahST7eCvceCT1KmY0VBvhXWTCljVtTnAUmPGOgK-JhXwyLUGU6o_L0IN8x16igBueRXVxt4Pz6PoA3Yru7TF9TQ0M'
    },
    { 
      name: 'Hossomaki', 
      path: '/menu#hossomaki',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3gJmO7X2JzXujwS9_95zJHV4hbjzgm4Yu-XnOE0gXR3YeDBfyGhE63RCIl_hwZnLHvTwq1xYdbA0iaT9PoRI9Izl_5Ojim6R9vfzA1ofeBe2AoWz6uEMGQMQ6aGPWhe9-tGrQh_bzDEl_UOuhAE5sr1kcCs36--l8RzHG9_459yJWyI-4mX4TGx_fipnxjfaRcDtQEz8QdOqME5LCMC1dn3h7d82rqeTk0woWISRyu24B7GNT17JDVqQF7vVfo-R0G8FYB2I-hZs'
    },
    { 
      name: 'Nigiri', 
      path: '/menu#nigiri',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDMg3N1lJEXbMk5Ffe1CJa__x0vkWqlwpKxTUk1EDezrN5V1PmLjMEvnz7gWrWtbQ_IBdRrL_K7MpH_Sxd0TrHo_na8m29TIXFCe2cRSuHsbWrniak472CumYmtLL2YsJtLG5Qoxnzd0bfzM_PJpoVs2wajdsrxyT6pT0ayb1d8WIloTrJI2KCSQQ3LWGDa2FjF6KNmOvLc-w18wzHOywj9ZcC34za9CmOlkBjzf9wOswnOuDj04Iy4EAxcfVJ5f8rFHjP-pi53knA'
    },
    { 
      name: 'Onigiri', 
      path: '/menu#onigiri',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGaTQhnVuXU4HtWaSyiX1bvOaOhCjVHpqXkOD2jfR5jfbAc_4cDT73ECd7FFyy7FGxYusouNNAG0Ti8_TEBV4dfjMkXKARPnzAsCL-FqQBSgHnMCK34li_k2qUBSORcKi6md6t1pF6o43usL_J0bfrzkWdGVAcb7HBnNKKXS3VzRGUQwIuo8A7xjrsymIp6KVO_v2Qs7og5tJVNcaFMB-zeIEzHA_W5CmufQXrQ5vuurbylkR-UtXNK8qL4e6b2ukNPHDrcRZcAOs'
    },
  ];

  return (
    <div className="home-page pb-24">
      {/* ── HOME/HERO & ABOUT US ───────────────────────────── */}
      <section className="min-h-screen flex flex-col md:flex-row items-center pt-24 md:pt-0 overflow-hidden relative">
        {/* Ambient watermark kanji */}
        <div
          className="absolute select-none pointer-events-none"
          style={{
            fontSize: 'clamp(10rem, 30vw, 25rem)',
            color: 'var(--color-primary)',
            opacity: 0.03,
            fontFamily: 'var(--font-serif)',
            fontWeight: 900,
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            whiteSpace: 'nowrap',
          }}
        >
          大和
        </div>

        {/* Hero Text */}
        <div className="w-full md:w-1/2 px-8 md:px-20 py-12 md:py-0 flex flex-col justify-center items-start space-y-10 order-2 md:order-1 relative z-10">
          <motion.div {...fadeUp(0.1)} className="space-y-2">
            <span className="text-xs uppercase tracking-[0.4em] text-primary font-bold font-sans">Est. MMXXIV</span>
            <div className="h-[1px] w-12 bg-primary"></div>
          </motion.div>

          <motion.h1 
            {...fadeUp(0.2)}
            className="serif drop-shadow-sm font-black"
            style={{
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              color: 'var(--color-foreground)',
              lineHeight: 1.1,
              letterSpacing: '-0.02em'
            }}
          >
            {t('hero_title_1')}<br/>
            <span className="text-primary italic font-light">{t('hero_title_highlight')}</span><br/>
            {t('hero_title_2')}
          </motion.h1>

          <motion.div {...fadeUp(0.3)} className="flex flex-col items-start w-full">
            <p className="font-sans text-lg text-muted max-w-md leading-relaxed border-l-2 border-primary/30 pl-6 mb-8 bg-white/60 py-2">
              <span className="font-bold text-foreground">{t('philosophy')}</span><br/>
              {t('description')}
            </p>
            
            {/* Merged About Us content */}
            <div className="bg-white/95 border-l-4 border-primary rounded-r-xl p-8 mb-10 shadow-lg max-w-lg">
              <h3 className="category-title" style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
                {t('about_title')}
              </h3>
              <p className="font-sans font-medium text-sm text-foreground leading-relaxed">
                {t('about_description')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 w-full pt-2">
              <Link href="/menu" className="btn-primary shadow-xl shadow-red-500/20 text-sm tracking-[0.2em] px-10 py-5 uppercase font-bold">
                {t('cta')}
              </Link>
            </div>
            
            <div className="mt-12 flex items-center gap-2 text-muted">
              <span className="text-xl">📍</span> 
              <span className="font-bold tracking-widest uppercase text-xs font-sans">Cheraga, Algiers</span>
            </div>
          </motion.div>
        </div>

        {/* Hero Image / Animation block */}
        <div className="w-full md:w-1/2 h-[50vh] md:h-screen relative overflow-hidden order-1 md:order-2 flex items-center justify-center -ml-4 z-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="w-4/5 h-4/5 relative shadow-2xl bg-white p-4"
            style={{ border: '1px solid var(--color-border)' }}
          >
            <div className="w-full h-full relative overflow-hidden bg-stone-100 group">
              {/* Using native img with object-cover and grayscale styling */}
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMg3N1lJEXbMk5Ffe1CJa__x0vkWqlwpKxTUk1EDezrN5V1PmLjMEvnz7gWrWtbQ_IBdRrL_K7MpH_Sxd0TrHo_na8m29TIXFCe2cRSuHsbWrniak472CumYmtLL2YsJtLG5Qoxnzd0bfzM_PJpoVs2wajdsrxyT6pT0ayb1d8WIloTrJI2KCSQQ3LWGDa2FjF6KNmOvLc-w18wzHOywj9ZcC34za9CmOlkBjzf9wOswnOuDj04Iy4EAxcfVJ5f8rFHjP-pi53knA"
                alt="Yamato Dz Signature"
                className="w-full h-full object-cover transition-all duration-[1500ms] ease-out"
                style={{ filter: 'grayscale(70%)', transform: 'scale(1.05)' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'grayscale(0%)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'grayscale(70%)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
              />
              <div className="absolute -bottom-4 -left-4 bg-foreground px-6 py-4 shadow-xl">
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-white font-bold">Signature</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── OUR MENU CATEGORIES ───────────────────────────────────── */}
      <section className="section-padding container mt-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 border-b border-primary/20 pb-8">
            <div className="max-w-xl">
              <h3 className="uppercase tracking-[0.4em] text-primary font-bold text-xs mb-4 font-sans border-l-2 border-primary pl-3">{t('our_menu')}</h3>
              <h2 className="category-title" style={{ fontSize: '3rem', margin: 0 }}>{t('menu_cta_title')}</h2>
            </div>
            <Link href="/menu" className="font-bold text-[10px] uppercase tracking-[0.3em] border-2 border-foreground px-10 py-4 hover:bg-foreground hover:text-white transition-all bg-white font-sans text-foreground">
              {t('view_menu')}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
              >
                <Link href={item.path} style={{ textDecoration: 'none' }}>
                  <div className="group relative h-[400px] overflow-hidden flex flex-col justify-end p-6 bg-white shadow-md border border-primary/10">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="absolute inset-0 w-full h-full object-cover transition-all duration-[2000ms] ease-out z-0"
                      style={{ filter: 'grayscale(80%)' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = 'grayscale(0%)';
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = 'grayscale(80%)';
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none transition-opacity duration-500 group-hover:opacity-90"></div>
                    
                    <div className="relative z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <span className="font-sans font-bold text-[10px] tracking-[0.3em] text-primary mb-2 block uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        Explore Collection
                      </span>
                      <h4 className="category-title text-white" style={{ margin: 0, fontSize: '2.5rem', textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
                        {item.name}
                      </h4>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
