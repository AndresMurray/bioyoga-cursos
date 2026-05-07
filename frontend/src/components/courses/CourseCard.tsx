'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface CourseProps {
  title: string;
  image: string;
  description: string;
  price: string;
}

const CourseCard = ({ title, image, description, price }: CourseProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card 
        onClick={() => setShowModal(true)}
        className="group cursor-pointer hover:-translate-y-1 hover:shadow-xl transition-all duration-300 animate-fade"
      >
        <div className="h-48 overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-2 line-clamp-1">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[40px]">
            {description}
          </p>
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <span className="font-bold text-primary text-lg">{price}</span>
            <Button variant="secondary" size="sm" className="bg-accent text-accent-foreground hover:bg-accent/80">
              Ver más
            </Button>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} className="p-0 overflow-hidden max-w-lg">
        <div className="h-64 overflow-hidden relative">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          <button 
            onClick={() => setShowModal(false)}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            ×
          </button>
        </div>
        <div className="p-8">
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            {description}
          </p>
          <div className="flex gap-6 items-center">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">Inversión</span>
              <span className="text-2xl font-bold text-primary">{price}</span>
            </div>
            <Button className="flex-1 py-6 text-base font-bold shadow-lg shadow-primary/30">
              Comprar Curso
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CourseCard;
