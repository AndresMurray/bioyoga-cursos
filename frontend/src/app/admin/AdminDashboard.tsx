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
      <div className="container max-w-6xl mx-auto px-4">
        {/* Editorial Premium Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3 font-serif">
              Panel de Administración <span className="inline-block animate-pulse">🔐</span>
            </h1>
            <p className="text-lg text-foreground/70 font-medium">
              Gestiona el espacio sagrado de BioYoga Consciente.
            </p>
          </div>
        </header>



        {/* Floating Glassmorphic Tabs Toolbar */}
        <div className="bg-white border border-border p-2 rounded-2xl md:rounded-full flex flex-col md:flex-row gap-2 w-full md:w-fit mb-12 shadow-sm">
          <button 
            onClick={() => setActiveTab('courses')}
            className={`flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-xl md:rounded-full font-bold text-sm transition-all duration-300 ${
              activeTab === 'courses' 
                ? 'bg-primary text-white shadow-sm scale-102 md:scale-105' 
                : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Gestión de Cursos
          </button>
          <button 
            onClick={() => setActiveTab('home_config')}
            className={`flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-xl md:rounded-full font-bold text-sm transition-all duration-300 ${
              activeTab === 'home_config' 
                ? 'bg-primary text-white shadow-sm scale-102 md:scale-105' 
                : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Configuración Home
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-xl md:rounded-full font-bold text-sm transition-all duration-300 ${
              activeTab === 'users' 
                ? 'bg-primary text-white shadow-sm scale-102 md:scale-105' 
                : 'text-foreground/80 hover:text-primary hover:bg-primary/5'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Gestión de Alumnos
          </button>
        </div>

        {/* Cursos Tab */}
        {activeTab === 'courses' && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold font-serif text-foreground">Cursos Disponibles</h2>
              <Button onClick={handleOpenCreateForm} className="shadow-md">
                + Nuevo Curso
              </Button>
            </div>
            
            {loading ? (
              <div className="text-center p-12 text-foreground/60 font-medium animate-pulse">
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
