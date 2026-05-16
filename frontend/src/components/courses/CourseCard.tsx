'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { PriceDisplay } from '@/components/ui/PriceDisplay';
import { ImageCarousel } from '@/components/ui/ImageCarousel';
import AuthModal from '@/components/auth/AuthModal';
import PurchaseConfirmationModal from '@/components/courses/PurchaseConfirmationModal';
import { Course } from '@/hooks/useCourses';
import { useHomeConfig } from '@/hooks/useHomeConfig';
import { api } from '@/lib/api';
import Link from 'next/link';

interface CourseCardProps {
  course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showAlreadyPurchased, setShowAlreadyPurchased] = useState(false);
  const { config, fetchConfig } = useHomeConfig();

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const images = course.images && course.images.length > 0 
    ? course.images.map(img => img.url) 
    : ['/images/placeholder.png'];

  const coverImage = images[0];

  const checkOwnershipAndPurchase = async () => {
    try {
      const myCourses = await api.get('/courses/my-courses');
      const alreadyOwned = myCourses.some((c: any) => c.id === course.id);
      if (alreadyOwned) {
        setShowAlreadyPurchased(true);
      } else {
        if (course.link_pago) {
          window.open(course.link_pago, '_blank');
        }
        setShowPurchaseModal(true);
      }
    } catch {
      // If check fails (e.g. token invalid), proceed with purchase
      if (course.link_pago) {
        window.open(course.link_pago, '_blank');
      }
      setShowPurchaseModal(true);
    }
  };

  const handleBuyClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');
    if (token) {
      setShowModal(false);
      await checkOwnershipAndPurchase();
    } else {
      // Prompt login/register
      setShowAuthModal(true);
      setShowModal(false); 
    }
  };

  return (
    <>
      <Card 
        className="group hover:-translate-y-1 hover:shadow-xl transition-all duration-300 animate-fade flex flex-col h-full"
      >
        <div className="h-48 overflow-hidden relative">
          <img src={coverImage} alt={course.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          {course.discount_percentage > 0 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
              {course.discount_percentage}% OFF
            </div>
          )}
        </div>
        <CardContent className="p-6 flex flex-col flex-grow">
          <h3 className="text-xl font-semibold mb-4 line-clamp-2 flex-grow">{course.title}</h3>
          
          <div className="flex justify-between items-center pt-4 border-t border-border mt-auto mb-5">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">Inversión</span>
              <PriceDisplay price={course.price} discountPercentage={course.discount_percentage} size="md" />
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="secondary" 
              className="flex-1 bg-accent text-accent-foreground hover:bg-accent/80"
              onClick={() => setShowModal(true)}
            >
              Ver más
            </Button>
            <Button 
              className="flex-1 shadow-md shadow-primary/20"
              onClick={handleBuyClick}
            >
              Comprar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} className="p-0 overflow-hidden max-w-lg">
        <div className="h-64 relative bg-muted">
          <ImageCarousel images={images} alt={course.title} />
          <button 
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-20"
          >
            ×
          </button>
        </div>
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">{course.title}</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed whitespace-pre-wrap">
            {course.description || 'Sin descripción'}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 items-center bg-muted/50 p-4 rounded-xl">
            <div className="flex flex-col flex-1 w-full">
              <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider mb-1">Inversión</span>
              <PriceDisplay price={course.price} discountPercentage={course.discount_percentage} size="lg" />
            </div>
            <Button 
              className="w-full sm:w-auto py-6 px-8 text-base font-bold shadow-lg shadow-primary/30 shrink-0"
              onClick={handleBuyClick}
            >
              Comprar Curso
            </Button>
          </div>
        </div>
      </Modal>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        contextMessage="Para comprar un curso primero debés iniciar sesión. Si no tenés cuenta, registrate."
        onLoginSuccess={async () => {
          try {
            const myCourses = await api.get('/courses/my-courses');
            const alreadyOwned = myCourses.some((c: any) => c.id === course.id);
            if (alreadyOwned) {
              sessionStorage.setItem('pendingPurchase', JSON.stringify({ alreadyOwned: true, courseTitle: course.title }));
            } else {
              if (course.link_pago) {
                window.open(course.link_pago, '_blank');
              }
              sessionStorage.setItem('pendingPurchase', JSON.stringify({ alreadyOwned: false, courseTitle: course.title }));
            }
          } catch {
            if (course.link_pago) {
              window.open(course.link_pago, '_blank');
            }
            sessionStorage.setItem('pendingPurchase', JSON.stringify({ alreadyOwned: false, courseTitle: course.title }));
          }
          window.location.href = '/client';
        }}
      />

      <PurchaseConfirmationModal
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        whatsappNumber={config?.whatsapp_number || ''}
        courseTitle={course.title}
      />

      {/* Already purchased modal */}
      <Modal isOpen={showAlreadyPurchased} onClose={() => setShowAlreadyPurchased(false)} className="max-w-md p-8">
        <div className="flex flex-col items-center text-center">
          <div className="text-5xl mb-5">✅</div>
          <h3 className="text-2xl font-bold text-primary mb-4">¡Ya tenés este curso!</h3>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            Ya tenés comprado el curso <strong className="text-foreground">{course.title}</strong>. Accedé al mismo desde <strong className="text-foreground">Mis Cursos</strong>.
          </p>
          <Link href="/client" className="w-full">
            <Button className="w-full mb-3">
              Ir a Mis Cursos
            </Button>
          </Link>
          <Button
            variant="secondary"
            onClick={() => setShowAlreadyPurchased(false)}
            className="w-full"
          >
            Cerrar
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default CourseCard;
