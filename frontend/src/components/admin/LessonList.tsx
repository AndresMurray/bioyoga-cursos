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
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center text-muted-foreground bg-white rounded-xl border border-border">
        <div className="text-5xl mb-4">🎥</div>
        <h3 className="text-xl font-semibold mb-2 text-foreground">No hay clases en este curso</h3>
        <p>Creá la primera clase para empezar a compartir contenido.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {lessons.map((lesson, index) => (
        <div 
          key={lesson.id} 
          className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white border border-border rounded-xl hover:bg-muted/50 transition-colors animate-fade gap-4"
        >
          <div className="flex items-start md:items-center gap-4">
            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-accent text-accent-foreground font-bold text-sm">
              {index + 1}
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-1 text-foreground">{lesson.title}</h4>
              <p className="text-sm text-muted-foreground line-clamp-2 max-w-2xl">
                {lesson.description || 'Sin descripción'}
              </p>
              
              <div className="flex flex-wrap gap-4 mt-2 text-xs font-medium">
                {lesson.link_drive && (
                  <span className="text-primary flex items-center gap-1.5">
                    🔗 Link a Video/Drive
                  </span>
                )}
                {lesson.pdfs && lesson.pdfs.length > 0 && (
                  <span className="text-primary flex items-center gap-1.5">
                    📄 {lesson.pdfs.length} recurso(s) PDF
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex gap-2 self-end md:self-auto shrink-0 mt-2 md:mt-0">
            <Button variant="secondary" size="sm" onClick={() => onEdit(lesson)}>
              Editar
            </Button>
            <Button variant="danger" size="sm" onClick={() => onDelete(lesson)}>
              Eliminar
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
