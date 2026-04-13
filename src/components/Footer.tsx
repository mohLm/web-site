import {useTranslations} from 'next-intl'
import {Link} from '@/navigation'

export default function Footer() {
  const t = useTranslations('Nav')
  const year = new Date().getFullYear()

  return (
    <footer className="bg-secondary section-padding pb-8">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-3xl font-bold tracking-tighter hover:opacity-100">
              <span className="serif italic">YAMATO</span>
              <span className="text-primary ml-1">DZ</span>
            </Link>
            <p className="mt-6 text-muted max-w-sm">
              Authentic Japanese flavors in the heart of Cheraga, Algiers. Experiencing the harmony between tradition and modern taste.
            </p>
          </div>
          
          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold mb-6 text-foreground">{t('menu')}</h4>
            <ul className="space-y-4 text-sm text-muted">
              <li><Link href="/menu#sushi" className="hover:text-primary transition-colors">Sushi & Roll</Link></li>
              <li><Link href="/menu#ramen" className="hover:text-primary transition-colors">Ramen Bowls</Link></li>
              <li><Link href="/menu#tempura" className="hover:text-primary transition-colors">Tempura Dishes</Link></li>
              <li><Link href="/menu#desserts" className="hover:text-primary transition-colors">Japanese Sweets</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold mb-6 text-foreground">Contact</h4>
            <ul className="space-y-4 text-sm text-muted">
              <li>Residence Sahraoui, Cheraga</li>
              <li>Algiers, Algeria</li>
              <li className="font-bold text-foreground">+213 (0) 555 123 456</li>
              <li>hello@yamatodz.com</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted tracking-widest uppercase">
          <p>© {year} YAMATO DZ. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="https://maps.google.com/?q=Yamato+Dz+Cheraga+Algiers" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Localisation</a>
            <a href="https://instagram.com/yamatodz" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
