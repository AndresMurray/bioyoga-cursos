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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm animate-fade">
      <div className="w-full max-w-2xl bg-white/80 backdrop-blur-md rounded-[2.5rem] rounded-tr-[0.75rem] rounded-bl-[0.75rem] border border-white/85 p-8 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="pb-6 border-b border-white/60 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold font-serif text-foreground">Gestionar Accesos</h2>
            <p className="text-foreground/75 font-medium text-sm mt-0.5">{student.first_name} {student.last_name} ({student.email})</p>
          </div>
          <button onClick={onClose} className="text-foreground/60 hover:text-foreground p-1 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div className="py-6 overflow-y-auto flex-grow">
          <h3 className="text-lg font-bold font-serif mb-4 text-foreground">Cursos Disponibles</h3>
          
          {loadingCourses ? (
            <div className="text-center py-8 text-foreground/60 font-medium animate-pulse">Cargando cursos...</div>
          ) : (
            <div className="grid gap-4">
              {courses.map((course) => {
                const enrolled = isEnrolled(course.id);
                return (
                  <div key={course.id} className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    enrolled ? 'bg-primary/10 border-primary/20 shadow-sm' : 'bg-white/40 border-white/60'
                  }`}>
                    <div>
                      <div className="font-bold text-foreground text-base flex items-center gap-2 flex-wrap">
                        {course.title}
                        {enrolled && (
                          <span className="text-[10px] font-extrabold bg-green-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Activo
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-foreground/50 font-medium mt-1">
                        Duración del acceso: {course.duracion_dias} días
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant={enrolled ? "outline" : "default"}
                      onClick={() => enrolled ? handleUnenroll(course.id) : handleEnroll(course.id)}
                      disabled={isSubmitting}
                      className={`rounded-full text-xs font-bold px-4 py-1.5 h-auto shrink-0 ${
                        enrolled ? "text-red-600 border-red-200 hover:bg-red-50" : "shadow-md"
                      }`}
                    >
                      {enrolled ? "Sacar Acceso" : "Habilitar Curso"}
                    </Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-white/60 flex justify-end">
          <Button variant="outline" onClick={onClose} className="rounded-full px-6 py-2 h-auto text-xs font-bold">Cerrar</Button>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentModal;
