import React from 'react';
import { cn } from '@/utils/cn';

interface PriceDisplayProps {
  price: number;
  discountPercentage?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PriceDisplay({
  price,
  discountPercentage = 0,
  className,
  size = 'md',
}: PriceDisplayProps) {
  // Calcular precio con descuento
  const hasDiscount = discountPercentage > 0 && discountPercentage <= 100;
  const finalPrice = hasDiscount
    ? Math.round(price * (1 - discountPercentage / 100))
    : price;

  // Formatear pesos (ej: $ 10.000)
  const formatPesos = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const sizeClasses = {
    sm: {
      original: 'text-xs',
      final: 'text-base',
      badge: 'text-[10px] px-1.5 py-0.5',
    },
    md: {
      original: 'text-sm',
      final: 'text-xl',
      badge: 'text-xs px-2 py-0.5',
    },
    lg: {
      original: 'text-base',
      final: 'text-3xl',
      badge: 'text-sm px-2.5 py-1',
    },
  };

  const styles = sizeClasses[size];

  if (price === 0) {
    return (
      <span className={cn("font-bold text-green-500", styles.final, className)}>
        Gratis
      </span>
    );
  }

  return (
    <div className={cn("flex flex-col items-start gap-1", className)}>
      {hasDiscount && (
        <div className="flex items-center gap-2">
          <span className={cn("text-muted-foreground line-through font-medium", styles.original)}>
            {formatPesos(price)}
          </span>
          <span className={cn("bg-red-500 text-white font-bold rounded-full", styles.badge)}>
            {discountPercentage}% OFF
          </span>
        </div>
      )}
      <span className={cn("font-bold text-foreground", styles.final)}>
        {formatPesos(finalPrice)}
      </span>
    </div>
  );
}
