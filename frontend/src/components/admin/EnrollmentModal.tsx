import React, { useState, useEffect } from 'react';
import { useCourses, Course } from '@/hooks/useCourses';
import { Student } from '@/hooks/useStudents';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface EnrollmentModalProps {
  student: Student;
  onClose: () => void;
  onEnroll: (courseId: number) => Promise<boolean>;
  onUnenroll: (courseId: number) => Promise<boolean>;
}

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ student, onClose, onEnroll, onUnenroll }) => {
  const { courses, fetchCourses, loading: loadingCourses } = useCourses();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleEnroll = async (courseId: number) => {
    setIsSubmitting(true);
    const success = await onEnroll(courseId);
    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  const handleUnenroll = async (courseId: number) => {
    setIsSubmitting(true);
    const success = await onUnenroll(courseId);
    setIsSubmitting(false);
    if (success) {
      onClose();
    }
  };

  const isEnrolled = (courseId: number) => {
    return student.active_courses.some(c => c.id === courseId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Gestionar Accesos</h2>
            <p className="text-muted-foreground">{student.first_name} {student.last_name} ({student.email})</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <h3 className="text-lg font-semibold mb-4">Cursos Disponibles</h3>
          
          {loadingCourses ? (
            <div className="text-center py-8 text-muted-foreground">Cargando cursos...</div>
          ) : (
            <div className="grid gap-4">
              {courses.map((course) => {
                const enrolled = isEnrolled(course.id);
                return (
                  <div key={course.id} className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                    enrolled ? 'bg-primary/5 border-primary/20' : 'bg-muted/30 border-border'
                  }`}>
                    <div>
                      <div className="font-semibold flex items-center gap-2">
                        {course.title}
                        {enrolled && <Badge variant="primary" size="sm">Activo</Badge>}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Duración: {course.duracion_dias} días
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant={enrolled ? "outline" : "primary"}
                      onClick={() => enrolled ? handleUnenroll(course.id) : handleEnroll(course.id)}
                      disabled={isSubmitting}
                      className={enrolled ? "text-red-500 border-red-200 hover:bg-red-50" : ""}
                    >
                      {enrolled ? "Sacar Acceso" : "Habilitar Curso"}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-border flex justify-end">
          <Button variant="outline" onClick={onClose}>Cerrar</Button>
        </div>
      </Card>
    </div>
  );
};

export default EnrollmentModal;
