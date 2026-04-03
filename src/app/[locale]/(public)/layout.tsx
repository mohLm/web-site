import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="japanese-pattern-bg min-h-screen flex flex-col relative w-full overflow-hidden">
      {/* Decorative Corner Brackets */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-10 left-10 w-16 h-16 border-t-2 border-l-2 border-foreground" />
        <div className="absolute top-12 left-8 w-16 h-16 border-t-2 border-l-2 border-foreground" />
        
        <div className="absolute top-10 right-10 w-16 h-16 border-t-2 border-r-2 border-foreground" />
        <div className="absolute top-12 right-8 w-16 h-16 border-t-2 border-r-2 border-foreground" />

        {/* Clouds Base (Top Left) */}
        <div className="absolute top-16 left-20 opacity-40">
           <svg width="200" height="120" viewBox="0 0 200 120" fill="var(--color-primary)">
              <path d="M 50 80 Q 50 50 80 50 Q 80 20 120 20 Q 150 20 160 50 Q 190 50 190 80 Z" />
              <path d="M 20 100 Q 20 80 40 80 Q 40 60 70 60 Q 90 60 100 80 Q 120 80 120 100 Z" opacity="0.6"/>
           </svg>
        </div>

        {/* Sakura Base (Bottom Right, fixed at viewport so it's always visible or just on scroll bottom? Bottom of normal page is better, but maybe just use fixed? Let's make it fixed so it decorates the screen) */}
        <div className="fixed bottom-0 right-0 opacity-40 pointer-events-none z-10">
           <svg width="250" height="250" viewBox="0 0 250 250" fill="none">
              <path d="M250,250 C180,250 120,200 80,120" stroke="var(--color-muted)" strokeWidth="3" />
              <circle cx="120" cy="180" r="12" fill="#F8B195" />
              <circle cx="100" cy="140" r="8" fill="#F67280" />
              <circle cx="160" cy="210" r="14" fill="#F8B195" />
              <circle cx="180" cy="150" r="10" fill="#F67280" />
           </svg>
        </div>
      </div>

      <Header />
      <div className="relative z-10 flex-grow">
        {children}
      </div>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
