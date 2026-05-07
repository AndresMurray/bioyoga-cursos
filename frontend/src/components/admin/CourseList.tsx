'use client';

import React from 'react';
import { Course } from '@/hooks/useCourses';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface CourseListProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (course: Course) => void;
}

export default function CourseList({ courses, onEdit, onDelete }: CourseListProps) {
  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center text-muted-foreground bg-white rounded-xl border border-border">
        <div className="text-5xl mb-4">📚</div>
        <h3 className="text-xl font-semibold mb-2 text-foreground">No hay cursos todavía</h3>
        <p>Creá tu primer curso para empezar.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => (
        <Card key={course.id} className="group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
          {course.image_url ? (
            <img 
              src={course.image_url} 
              alt={course.title} 
              className="w-full h-48 object-cover bg-muted" 
            />
          ) : (
            <div className="w-full h-48 bg-muted flex items-center justify-center text-5xl">
              📖
            </div>
          )}
          <CardContent className="p-5">
            <h4 className="text-lg font-semibold mb-2 line-clamp-1">{course.title}</h4>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 min-h-[40px]">
              {course.description || 'Sin descripción'}
            </p>
            
            <Badge variant={course.is_visible ? 'success' : 'secondary'} className="mb-4">
              {course.is_visible ? 'Visible' : 'Oculto'}
            </Badge>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-border">
              <span className="text-xs text-muted-foreground font-medium">
                {course.duracion_dias} días
              </span>
              <div className="flex gap-2">
                <Link href={`/admin/courses/${course.id}`}>
                  <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                    Clases
                  </Button>
                </Link>
                <Button variant="secondary" size="sm" className="h-8 px-3 text-xs" onClick={() => onEdit(course)}>
                  Editar
                </Button>
                <Button variant="danger" size="sm" className="h-8 px-3 text-xs" onClick={() => onDelete(course)}>
                  Eliminar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
