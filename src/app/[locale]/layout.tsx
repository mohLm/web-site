import type { Metadata } from "next";
import "../yamato.css";

import { getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "YAMATO DZ | Authentic Japanese Cuisine in Algiers",
  description: "Experience the art of Japanese dining in the heart of Cheraga, Algiers. Premium sushi, ramen, and more.",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <CartProvider>
            {children}
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
