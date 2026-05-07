'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useLessons, Lesson } from '@/hooks/useLessons';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import LessonList from '@/components/admin/LessonList';
import LessonForm from '@/components/admin/LessonForm';
import ConfirmModal from '@/components/common/ConfirmModal';
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
    } else {
      alert("Error al eliminar la clase.");
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
        <div className="container max-w-5xl">
          <Link 
            href="/admin" 
            className="inline-flex items-center text-primary font-semibold hover:text-primary/80 transition-colors mb-8"
          >
            ← Volver al Panel
          </Link>

          <Card className="mb-12">
            <CardContent className="p-8">
              <h1 className="text-3xl font-bold mb-3 text-foreground">{course.title}</h1>
              <p className="text-muted-foreground text-lg mb-6 max-w-3xl">
                {course.description || 'Sin descripción'}
              </p>
              <div className="flex items-center gap-4">
                <Badge variant={course.is_visible ? 'success' : 'secondary'}>
                  {course.is_visible ? 'Visible en tienda' : 'Oculto'}
                </Badge>
                <span className="text-sm font-medium text-muted-foreground">
                  {course.duracion_dias} días de acceso
                </span>
              </div>
            </CardContent>
          </Card>

          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h2 className="text-2xl font-semibold text-foreground">
                Clases del Curso <span className="text-muted-foreground">({lessons.length})</span>
              </h2>
              <Button onClick={handleOpenCreateForm}>
                + Nueva Clase
              </Button>
            </div>

            {lessonsLoading ? (
              <div className="text-center py-12 text-muted-foreground">
                <div className="animate-pulse">Cargando clases...</div>
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
      </div>
    </ProtectedRoute>
  );
}
