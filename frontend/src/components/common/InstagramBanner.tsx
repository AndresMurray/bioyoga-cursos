'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';

const InstagramBanner = () => {
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(false);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  if (dismissed) return null;

  return (
    <div
      id="instagram-banner"
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #833AB4 0%, #C13584 25%, #E1306C 50%, #F77737 75%, #FCAF45 100%)',
        padding: '0',
      }}
    >
      {/* Animated shimmer overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
          animation: 'shimmerSlide 3s ease-in-out infinite',
        }}
      />

      <a
        href="https://instagram.com/bioyogaconscienteok"
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 flex items-center justify-center gap-3 py-3 px-4 text-white no-underline transition-all group"
        style={{ textDecoration: 'none' }}
      >
        {/* Instagram icon */}
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          fill="currentColor"
          className="flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
        >
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>

        {/* Text */}
        <span className="text-sm md:text-base font-semibold tracking-wide">
          <span className="hidden sm:inline">✨ Seguinos en Instagram para otros cursos, novedades y más → </span>
          <span className="sm:hidden">✨ Seguinos en Instagram → </span>
          <span
            className="font-bold underline underline-offset-2 decoration-white/60 group-hover:decoration-white transition-all"
          >
            @bioyogaconscienteok
          </span>
        </span>

        {/* Arrow animation */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-4 h-4 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
        </svg>
      </a>

      {/* Dismiss button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDismissed(true);
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 text-white/70 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
        aria-label="Cerrar banner de Instagram"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Inline keyframes for shimmer */}
      <style>{`
        @keyframes shimmerSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default InstagramBanner;
