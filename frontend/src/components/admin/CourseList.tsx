'use client';

import React from 'react';
import { Course } from '@/hooks/useCourses';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PriceDisplay } from '@/components/ui/PriceDisplay';

interface CourseListProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

export default function CourseList({ courses, onEdit, onDelete }: CourseListProps) {
  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white/40 border border-white/60 rounded-[2.5rem] rounded-tr-[0.75rem] rounded-bl-[0.75rem] shadow-sm backdrop-blur-md max-w-xl mx-auto animate-fade">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-4xl mb-4 animate-bounce">
          📚
        </div>
        <h3 className="text-2xl font-bold font-serif mb-2 text-foreground">El Taller está en Silencio</h3>
        <p className="text-foreground/70 max-w-md">No hay cursos ni programas creados aún. ¡Es un lienzo en blanco para compartir tu luz y conocimiento!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map(course => (
        <div 
          key={course.id} 
          className="group flex flex-col bg-white/50 backdrop-blur-sm border border-white/70 rounded-[2rem] rounded-tr-[0.5rem] rounded-bl-[0.5rem] shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
        >
          {/* Zooming Image Section */}
          <div className="relative h-48 overflow-hidden bg-primary/5 shrink-0">
            {course.images && course.images.length > 0 ? (
              <img 
                src={course.images.find(img => img.is_cover)?.url || course.images[0].url} 
                alt={course.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl">
                🧘‍♀️
              </div>
            )}
            <div className="absolute top-4 left-4">
              <Badge variant={course.is_visible ? 'success' : 'secondary'} className="shadow-sm">
                {course.is_visible ? 'Visible' : 'Oculto'}
              </Badge>
            </div>
          </div>

          <div className="p-6 flex flex-col flex-grow">
            <h4 className="text-xl font-bold font-serif mb-2 text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {course.title}
            </h4>
            <p className="text-sm text-foreground/70 mb-5 line-clamp-2 min-h-[40px] leading-relaxed">
              {course.description || 'Sin descripción'}
            </p>
            
            <div className="flex justify-between items-center mb-5 mt-auto">
              <span className="text-xs text-foreground/60 font-bold bg-primary/10 px-3 py-1 rounded-full">
                {course.duracion_dias} días de acceso
              </span>
              <PriceDisplay 
                price={course.price || 0} 
                discountPercentage={course.discount_percentage || 0} 
                size="sm" 
              />
            </div>

            <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/60 gap-2">
              <Link href={`/admin/courses/${course.id}`} className="flex-grow">
                <Button variant="outline" size="sm" className="w-full h-9 rounded-full text-xs font-bold transition-all">
                  Clases
                </Button>
              </Link>
              <Button 
                variant="secondary" 
                size="sm" 
                className="h-9 px-4 rounded-full text-xs font-bold transition-all" 
                onClick={() => onEdit(course)}
              >
                Editar
              </Button>
              <Button 
                variant="danger" 
                size="sm" 
                className="h-9 px-4 rounded-full text-xs font-bold transition-all" 
                onClick={() => onDelete(course)}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
