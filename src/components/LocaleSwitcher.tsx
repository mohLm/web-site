'use client';

import {useLocale} from 'next-intl';
import {routing, usePathname, useRouter} from '@/navigation';
import {useParams} from 'next/navigation';
import {useTransition} from 'react';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const params = useParams();

  function onSelect(nextLocale: string) {
    if (nextLocale === locale) return;
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- pathname is correct
        {pathname, params},
        {locale: nextLocale}
      );
    });
  }

  return (
    <div className="flex items-center gap-3 text-[0.65rem] font-bold tracking-[0.2em] uppercase">
      {routing.locales.map((cur) => (
        <button
          key={cur}
          disabled={isPending}
          onClick={() => onSelect(cur)}
          className={`transition-colors duration-300 ${
            locale === cur 
              ? 'text-primary border-b border-primary pb-1' 
              : 'text-muted hover:text-foreground pb-1'
          }`}
          style={{ opacity: isPending ? 0.5 : 1 }}
        >
          {cur}
        </button>
      ))}
    </div>
  );
}
