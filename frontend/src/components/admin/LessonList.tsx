'use client';

import React from 'react';
import { Lesson } from '@/hooks/useCourses';
import { Button } from '@/components/ui/Button';

interface LessonListProps {
  lessons: Lesson[];
  onEdit: (lesson: Lesson) => void;
  onDelete: (lesson: Lesson) => void;
}

export default function LessonList({ lessons, onEdit, onDelete }: LessonListProps) {
  if (lessons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white/40 border border-white/60 rounded-[2.5rem] rounded-tr-[0.75rem] rounded-bl-[0.75rem] shadow-sm backdrop-blur-md max-w-xl mx-auto animate-fade">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-4xl mb-4 animate-bounce">
          🎥
        </div>
        <h3 className="text-2xl font-bold font-serif mb-2 text-foreground">El Taller no tiene Clases</h3>
        <p className="text-foreground/70 max-w-md">No hay clases ni contenidos cargados en este curso todavía. ¡Es el momento de crear tu primera lección!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {lessons.map((lesson, index) => (
        <div 
          key={lesson.id} 
          className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white/50 border border-white/70 rounded-3xl hover:bg-white/70 transition-all duration-300 animate-fade gap-5 shadow-sm"
        >
          <div className="flex items-start md:items-center gap-5">
            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold text-base shadow-sm border border-white/50">
              {index + 1}
            </div>
            <div>
              <h4 className="text-xl font-bold font-serif mb-1.5 text-foreground leading-tight">{lesson.title}</h4>
              <p className="text-sm text-foreground/75 line-clamp-2 max-w-2xl leading-relaxed">
                {lesson.description || 'Sin descripción'}
              </p>
              
              <div className="flex flex-wrap gap-3 mt-3 text-xs font-bold">
                {lesson.link_drive && (
                  <span className="text-primary bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    🎥 Link a Video/Drive
                  </span>
                )}
                {lesson.pdfs && lesson.pdfs.length > 0 && (
                  <span className="text-primary bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    📄 {lesson.pdfs.length} recurso(s) PDF
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 self-end md:self-auto shrink-0 mt-2 md:mt-0">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => onEdit(lesson)}
              className="rounded-full text-xs font-bold px-4 h-9 shadow-sm"
            >
              Editar
            </Button>
            <Button 
              variant="danger" 
              size="sm" 
              onClick={() => onDelete(lesson)}
              className="rounded-full text-xs font-bold px-4 h-9 shadow-sm"
            >
              Eliminar
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
