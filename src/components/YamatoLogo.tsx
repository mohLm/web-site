import React from 'react';

interface YamatoLogoProps {
  className?: string;
  showText?: boolean;
}

export default function YamatoLogo({ className = "", showText = true }: YamatoLogoProps) {
  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      <img 
        src="/logo.jpg" 
        alt="Yamato Logo" 
        className="w-auto h-auto max-w-[200px] md:max-w-[250px] object-contain drop-shadow-sm mix-blend-multiply"
      />
    </div>
  );
}
