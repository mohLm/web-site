import React from 'react';

interface YamatoLogoProps {
  className?: string;
  showText?: boolean;
}

export default function YamatoLogo({ className = "", showText = true }: YamatoLogoProps) {
  // We use logo.png by default so the user's new cropped logo works, but fallback to logo.jpg
  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <img 
        src="/logo.jpg" 
        alt="Yamato Logo" 
        className="w-auto h-full max-h-full object-contain mix-blend-multiply"
        style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }}
      />
    </div>
  );
}
