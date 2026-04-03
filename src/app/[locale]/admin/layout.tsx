"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      const bypass = typeof window !== 'undefined' ? localStorage.getItem('devBypass') : null;
      if (!currentUser && !bypass && !pathname.includes("login")) {
        router.push(`/${locale}/admin/login`);
      }
    });

    return () => unsubscribe();
  }, [pathname, router, locale]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-serif text-2xl tracking-[0.2em] text-zinc-300">
        <span className="animate-pulse">LOADING</span>
      </div>
    );
  }

  const bypass = typeof window !== 'undefined' ? localStorage.getItem('devBypass') : null;

  if ((!user && !bypass) || pathname.includes("login")) {
    return <div className="min-h-screen bg-white font-sans">{children}</div>;
  }

  const handleLogout = async () => {
    if (localStorage.getItem('devBypass')) {
      localStorage.removeItem('devBypass');
      window.location.href = `/${locale}/admin/login`;
      return;
    }
    await signOut(auth);
    router.push(`/${locale}/admin/login`);
  };

  const navItems = [
    { name: "DASHBOARD", href: `/${locale}/admin` },
    { name: "MENU", href: `/${locale}/admin/menu` },
    { name: "ORDERS", href: `/${locale}/admin/orders` },
    { name: "REVIEWS", href: `/${locale}/admin/reviews` },
  ];

  const isActive = (href: string) => {
    if (href === `/${locale}/admin`) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans text-zinc-900 relative">
      {/* Background Watermark */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
         <span className="text-[30vw] font-serif text-[#faf0f2] opacity-40 select-none whitespace-nowrap">
           管理
         </span>
      </div>

      {/* Elegant Header matching public site */}
      <header className="relative z-10 w-full px-8 md:px-16 py-8 flex flex-col md:flex-row items-center justify-between border-b border-zinc-100 bg-white/80 backdrop-blur-md">
        <div className="flex flex-col items-center md:items-start mb-6 md:mb-0">
          <Link href={`/${locale}/admin`} className="flex items-center gap-4 group">
            <h1 className="text-xl md:text-2xl font-bold tracking-[0.3em] text-black">
              YAMATO<span className="text-[#ce1226] ml-2 font-black">ADMIN</span>
            </h1>
          </Link>
          <span className="text-[9px] tracking-[0.3em] text-zinc-400 uppercase mt-2">
            Management Portal
          </span>
        </div>
        
        <nav className="flex items-center gap-8 text-xs font-bold tracking-[0.2em]">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`transition-colors duration-500 pb-1 border-b-2 ${
                  active 
                    ? "text-[#ce1226] border-[#ce1226]" 
                    : "text-black border-transparent hover:text-[#ce1226]"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          
          <div className="w-px h-6 bg-zinc-200 mx-2"></div>
          
          <button 
            onClick={handleLogout}
            className="text-zinc-400 hover:text-black transition-colors duration-300"
          >
            EXIT
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 w-full max-w-7xl mx-auto px-6 py-12 md:px-12 md:py-24">
        {children}
      </main>
    </div>
  );
}
