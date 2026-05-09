'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';

interface ImageCarouselProps {
  images: string[];
  alt?: string;
  className?: string;
}

export function ImageCarousel({ images, alt = "Image", className }: ImageCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback para cuando no hay imágenes
  const validImages = images && images.length > 0 ? images : ['/images/placeholder.png'];
  const hasMultiple = validImages.length > 1;

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const scrollPosition = scrollRef.current.scrollLeft;
    const width = scrollRef.current.offsetWidth;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };

  const scrollTo = (index: number) => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.offsetWidth;
    scrollRef.current.scrollTo({ left: width * index, behavior: 'smooth' });
  };

  const next = () => {
    const newIndex = (currentIndex + 1) % validImages.length;
    scrollTo(newIndex);
  };

  const prev = () => {
    const newIndex = (currentIndex - 1 + validImages.length) % validImages.length;
    scrollTo(newIndex);
  };

  return (
    <div className={cn("relative group w-full h-full overflow-hidden", className)}>
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {validImages.map((src, i) => (
          <div key={i} className="min-w-full h-full snap-center relative">
            <img 
              src={src} 
              alt={`${alt} ${i + 1}`} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                // Fallback for broken images
                (e.target as HTMLImageElement).src = '/images/placeholder.png';
              }}
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      {hasMultiple && (
        <>
          <button 
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 z-10"
          >
            &#10094;
          </button>
          <button 
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 z-10"
          >
            &#10095;
          </button>
          
          {/* Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-y-1/2 flex gap-1.5 z-10">
            {validImages.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  i === currentIndex ? "bg-primary w-4" : "bg-white/50 hover:bg-white/80"
                )}
                aria-label={`Ir a imagen ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
