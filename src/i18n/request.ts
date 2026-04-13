import { getRequestConfig } from 'next-intl/server';
import { routing } from '../navigation';

export default getRequestConfig(async ({ requestLocale }) => {
  // Validate that the incoming `locale` parameter is valid
  const locales: readonly string[] = routing.locales;
  let resolvedLocale = await requestLocale;
  
  if (!resolvedLocale || !locales.includes(resolvedLocale as string)) {
    resolvedLocale = routing.defaultLocale;
  }

  return {
    locale: resolvedLocale as string,
    messages: (await import(`../messages/${resolvedLocale}.json`)).default
  };
});
