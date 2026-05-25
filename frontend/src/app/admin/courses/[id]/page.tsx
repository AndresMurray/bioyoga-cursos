'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useLessons, Lesson } from '@/hooks/useLessons';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LessonList from '@/components/admin/LessonList';
import LessonForm from '@/components/admin/LessonForm';
import ConfirmModal from '@/components/common/ConfirmModal';
import NotificationModal, { NotificationType } from '@/components/common/NotificationModal';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';

export default function CourseDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = parseInt(params.id as string, 10);

  const [course, setCourse] = useState<any>(null);
  const [courseLoading, setCourseLoading] = useState(true);
  const [courseError, setCourseError] = useState('');

  const { lessons, loading: lessonsLoading, fetchLessons, createLesson, updateLesson, deleteLesson } = useLessons(courseId);

  // Modals state
  const [isLessonFormOpen, setIsLessonFormOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [notification, setNotification] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: NotificationType;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });


  useEffect(() => {
    if (isNaN(courseId)) {
      router.push('/admin');
      return;
    }

    const fetchCourse = async () => {
      setCourseLoading(true);
      setCourseError('');
      try {
        const data = await api.get(`/courses/${courseId}`);
        setCourse(data);
      } catch (err: any) {
        setCourseError(err.message || 'Error al cargar el curso');
      } finally {
        setCourseLoading(false);
      }
    };

    fetchCourse();
    fetchLessons();
  }, [courseId, router, fetchLessons]);

  const handleOpenCreateForm = () => {
    setEditingLesson(null);
    setIsLessonFormOpen(true);
  };

  const handleOpenEditForm = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setIsLessonFormOpen(true);
  };

  const handleSubmitLesson = async (data: Partial<Lesson>) => {
    let success = false;
    if (editingLesson) {
      const updated = await updateLesson(editingLesson.id, data);
      success = !!updated;
    } else {
      const created = await createLesson(courseId, data);
      success = !!created;
    }

    if (success) {
      setIsLessonFormOpen(false);
      setEditingLesson(null);
    }
    return success;
  };

  const handleOpenDeleteModal = (lesson: Lesson) => {
    setLessonToDelete(lesson);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!lessonToDelete) return;
    setIsDeleting(true);
    const success = await deleteLesson(lessonToDelete.id);
    setIsDeleting(false);
    if (success) {
      setIsDeleteModalOpen(false);
      setLessonToDelete(null);
      setNotification({
        isOpen: true,
        title: '¡Éxito!',
        message: 'Clase eliminada correctamente.',
        type: 'success'
      });
    } else {
      setNotification({
        isOpen: true,
        title: 'Error',
        message: 'No se pudo eliminar la clase.',
        type: 'error'
      });
    }
  };


  if (courseLoading) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <div className="flex justify-center items-center py-24 text-muted-foreground">
          <div className="animate-pulse">Cargando detalles del curso...</div>
        </div>
      </ProtectedRoute>
    );
  }

  if (courseError || !course) {
    return (
      <ProtectedRoute requireAdmin={true}>
        <div className="container py-24">
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-center border border-red-200">
            {courseError || 'Curso no encontrado'}
          </div>
          <div className="flex justify-center">
            <Link href="/admin">
              <Button variant="outline">Volver al Panel</Button>
            </Link>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="animate-fade min-h-[80vh] py-16">
        <div className="container max-w-5xl mx-auto px-4">
          <Link 
            href="/admin" 
            className="inline-flex items-center text-primary font-bold hover:text-primary/85 transition-all hover:-translate-x-1.5 duration-300 gap-1.5 mb-8 text-sm"
          >
            <span className="text-base">←</span> Volver al Panel de Admin
          </Link>

          <div className="bg-white/45 backdrop-blur-md rounded-[2.5rem] rounded-tr-[0.75rem] rounded-bl-[0.75rem] border border-white/70 p-8 shadow-sm mb-12 animate-fade">
            <h1 className="text-3xl md:text-4xl font-bold font-serif mb-3 text-foreground">{course.title}</h1>
            <p className="text-foreground/75 text-lg mb-6 max-w-3xl leading-relaxed">
              {course.description || 'Sin descripción'}
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Badge variant={course.is_visible ? 'success' : 'secondary'} className="shadow-sm">
                {course.is_visible ? 'Visible en tienda' : 'Oculto'}
              </Badge>
              <span className="text-xs font-bold text-foreground/60 bg-primary/10 px-3 py-1 rounded-full">
                {course.duracion_dias} días de acceso para alumnos
              </span>
            </div>
          </div>

          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold font-serif text-foreground flex items-center gap-2.5">
                Clases del Curso 
                <span className="bg-primary text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-sm">
                  {lessons.length}
                </span>
              </h2>
              <Button onClick={handleOpenCreateForm} className="shadow-md rounded-full font-bold">
                + Nueva Clase
              </Button>
            </div>

            {lessonsLoading ? (
              <div className="text-center py-12 text-foreground/60 font-medium animate-pulse">
                Cargando el listado de clases...
              </div>
            ) : (
              <LessonList
                lessons={lessons}
                onEdit={handleOpenEditForm}
                onDelete={handleOpenDeleteModal}
              />
            )}
          </div>
        </div>

        {/* Modals */}
        {isLessonFormOpen && (
          <LessonForm
            lesson={editingLesson}
            onSubmit={handleSubmitLesson}
            onCancel={() => {
              setIsLessonFormOpen(false);
              setEditingLesson(null);
            }}
          />
        )}

        <ConfirmModal
          isOpen={isDeleteModalOpen}
          title="Eliminar Clase"
          message={`¿Estás seguro que querés eliminar la clase "${lessonToDelete?.title}"? Esta acción no se puede deshacer.`}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setIsDeleteModalOpen(false);
            setLessonToDelete(null);
          }}
          isLoading={isDeleting}
        />


      <NotificationModal
        isOpen={notification.isOpen}
        title={notification.title}
        message={notification.message}
        type={notification.type}
        onClose={() => setNotification(prev => ({ ...prev, isOpen: false }))}
      />

      </div>
    </ProtectedRoute>
  );
}
