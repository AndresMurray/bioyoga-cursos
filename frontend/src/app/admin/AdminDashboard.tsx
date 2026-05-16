'use client';

import React, { useState, useEffect } from 'react';
import { useCourses, Course } from '@/hooks/useCourses';
import CourseList from '@/components/admin/CourseList';
import CourseForm from '@/components/admin/CourseForm';
import HomeConfigForm from '@/components/admin/HomeConfigForm';
import StudentManagement from '@/components/admin/StudentManagement';
import ConfirmModal from '@/components/common/ConfirmModal';
import NotificationModal, { NotificationType } from '@/components/common/NotificationModal';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'users' | 'home_config'>('courses');
  const { courses, loading, error, fetchCourses, createCourse, updateCourse, deleteCourse } = useCourses();

  
  // Modals state
  const [isCourseFormOpen, setIsCourseFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
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


  // Mock data for users tab (to be implemented later)
  const [users] = useState([
    { id: 1, name: "Andrés Murray", email: "andres@email.com", activeCourses: ["Kinesiología Deportiva Avanzada"] },
    { id: 2, name: "Lucía Pérez", email: "lucia@email.com", activeCourses: [] },
  ]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleOpenCreateForm = () => {
    setEditingCourse(null);
    setIsCourseFormOpen(true);
  };

  const handleOpenEditForm = (course: Course) => {
    setEditingCourse(course);
    setIsCourseFormOpen(true);
  };

  const handleSubmitCourse = async (data: Partial<Course>) => {
    let success = false;
    if (editingCourse) {
      const updated = await updateCourse(editingCourse.id, data);
      success = !!updated;
    } else {
      const created = await createCourse(data);
      success = !!created;
    }
    
    if (success) {
      setIsCourseFormOpen(false);
      setEditingCourse(null);
    }
    return success;
  };

  const handleOpenDeleteModal = (course: Course) => {
    setCourseToDelete(course);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;
    setIsDeleting(true);
    const success = await deleteCourse(courseToDelete.id);
    setIsDeleting(false);
    if (success) {
      setIsDeleteModalOpen(false);
      setCourseToDelete(null);
      setNotification({
        isOpen: true,
        title: '¡Éxito!',
        message: 'Curso eliminado correctamente.',
        type: 'success'
      });
    } else {
      // El error se manejará en el useEffect
    }
  };

  // Efecto para mostrar alertas de error
  useEffect(() => {
    if (error && !loading) {
      setNotification({
        isOpen: true,
        title: 'Error',
        message: error,
        type: 'error'
      });
    }
  }, [error, loading]);



  return (
    <div className="animate-fade min-h-[80vh] py-16">
      <div className="container">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2 text-foreground">Panel de Administración 🔐</h1>
          <p className="text-muted-foreground">Gestiona los cursos y los alumnos de Centra.</p>
        </header>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-border mb-12">
          <button 
            onClick={() => setActiveTab('courses')}
            className={`pb-4 font-semibold transition-all border-b-2 ${
              activeTab === 'courses' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-primary'
            }`}
          >
            Gestión de Cursos
          </button>
          <button 
            onClick={() => setActiveTab('home_config')}
            className={`pb-4 font-semibold transition-all border-b-2 ${
              activeTab === 'home_config' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-primary'
            }`}
          >
            Configuración Home
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`pb-4 font-semibold transition-all border-b-2 ${
              activeTab === 'users' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-muted-foreground hover:text-primary'
            }`}
          >
            Gestión de Alumnos
          </button>
        </div>

        {/* Cursos Tab */}
        {activeTab === 'courses' && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-semibold">Cursos Disponibles</h2>
              <Button onClick={handleOpenCreateForm}>
                + Nuevo Curso
              </Button>
            </div>
            
            {loading ? (
              <div className="text-center p-12 text-muted-foreground">
                Cargando cursos...
              </div>
            ) : (
              <CourseList 
                courses={courses} 
                onEdit={handleOpenEditForm} 
                onDelete={handleOpenDeleteModal} 
              />
            )}
          </div>
        )}

        {/* Home Config Tab */}
        {activeTab === 'home_config' && (
          <HomeConfigForm />
        )}

        {/* Alumnos Tab */}
        {activeTab === 'users' && (
          <StudentManagement />
        )}
      </div>

      {/* Modals */}
      {isCourseFormOpen && (
        <CourseForm 
          course={editingCourse}
          onSubmit={handleSubmitCourse}
          onCancel={() => {
            setIsCourseFormOpen(false);
            setEditingCourse(null);
          }}
        />
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Eliminar Curso"
        message={`¿Estás seguro que querés eliminar el curso "${courseToDelete?.title}"? Esta acción eliminará también todas sus clases y no se puede deshacer.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setCourseToDelete(null);
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
  );
};

export default AdminDashboard;
