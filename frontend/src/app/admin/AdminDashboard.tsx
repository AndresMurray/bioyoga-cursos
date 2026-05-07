'use client';

import React, { useState, useEffect } from 'react';
import { useCourses, Course } from '@/hooks/useCourses';
import CourseList from '@/components/admin/CourseList';
import CourseForm from '@/components/admin/CourseForm';
import ConfirmModal from '@/components/common/ConfirmModal';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'courses' | 'users'>('courses');
  const { courses, loading, fetchCourses, createCourse, updateCourse, deleteCourse } = useCourses();
  
  // Modals state
  const [isCourseFormOpen, setIsCourseFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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
    } else {
      alert("Error al eliminar el curso.");
    }
  };

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

        {/* Alumnos Tab (Mock for now) */}
        {activeTab === 'users' && (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Alumno</th>
                    <th className="px-6 py-4 font-semibold">Cursos Activos</th>
                    <th className="px-6 py-4 font-semibold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">{user.name}</div>
                        <div className="text-muted-foreground">{user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {user.activeCourses.length > 0 ? user.activeCourses.map((c, i) => (
                            <Badge key={i} variant="secondary">{c}</Badge>
                          )) : (
                            <span className="text-muted-foreground italic">Ninguno</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="outline" size="sm">
                          Gestionar Accesos
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
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
    </div>
  );
};

export default AdminDashboard;
