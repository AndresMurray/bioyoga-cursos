'use client';

import React, { useState, useEffect } from 'react';
import CourseCard from '@/components/courses/CourseCard';
import { useMyCourses } from '@/hooks/useMyCourses';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/Badge';

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState<'my-courses' | 'store' | 'profile'>('my-courses');
  const { user } = useAuth();
  const { courses, loading, fetchMyCourses } = useMyCourses();

  useEffect(() => {
    fetchMyCourses();
  }, [fetchMyCourses]);

  const availableCourses: any[] = [
    // We could fetch these too, but for now let's keep it as is or empty
  ];

  return (
    <div className="animate-fade" style={{ minHeight: '80vh', padding: '4rem 0' }}>
      <div className="container">
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Hola, {user?.first_name || 'Alumno'} 👋</h1>
          <p style={{ color: 'var(--muted-foreground)' }}>Bienvenido a tu panel personal de Centra.</p>
        </header>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          borderBottom: '1px solid var(--border)',
          marginBottom: '3rem'
        }}>
          <button 
            onClick={() => setActiveTab('my-courses')}
            style={{
              padding: '1rem 0',
              borderBottom: activeTab === 'my-courses' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'my-courses' ? 'var(--primary)' : 'var(--muted-foreground)',
              fontWeight: 600,
              backgroundColor: 'transparent'
            }}
          >
            Mis Cursos
          </button>
          <button 
            onClick={() => setActiveTab('store')}
            style={{
              padding: '1rem 0',
              borderBottom: activeTab === 'store' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'store' ? 'var(--primary)' : 'var(--muted-foreground)',
              fontWeight: 600,
              backgroundColor: 'transparent'
            }}
          >
            Explorar Cursos
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            style={{
              padding: '1rem 0',
              borderBottom: activeTab === 'profile' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'profile' ? 'var(--primary)' : 'var(--muted-foreground)',
              fontWeight: 600,
              backgroundColor: 'transparent'
            }}
          >
            Mi Perfil
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'my-courses' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground italic">Cargando tus cursos...</div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground italic">
                Aún no tienes cursos asignados. ¡Explora nuestra tienda!
              </div>
            ) : (
              courses.map((course) => (
                <div key={course.id} style={{
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  <img 
                    src={course.images[0]?.url || '/images/course-placeholder.png'} 
                    alt={course.title} 
                    style={{ width: '100%', height: '180px', objectFit: 'cover' }} 
                  />
                  <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>{course.title}</h3>
                    <div style={{ marginBottom: '1.5rem', fontSize: '0.85rem' }}>
                      <Badge variant="secondary" size="sm">
                        Acceso hasta: {new Date(course.end_date).toLocaleDateString()}
                      </Badge>
                    </div>
                    
                    <button style={{
                      marginTop: 'auto',
                      width: '100%',
                      padding: '0.8rem',
                      borderRadius: '0.8rem',
                      backgroundColor: 'var(--primary)',
                      color: 'white',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}>
                      Ingresar al Curso
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'store' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {availableCourses.map((course, i) => (
              <CourseCard 
                key={i}
                course={course as any}
              />
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: 'var(--radius)', 
            border: '1px solid var(--border)', 
            padding: '2.5rem',
            maxWidth: '600px'
          }}>
            <h3 style={{ marginBottom: '2rem' }}>Información de la Cuenta</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>Nombre</label>
                <input type="text" defaultValue="Andrés Murray" style={{
                  padding: '0.8rem', borderRadius: '0.8rem', border: '1px solid var(--border)'
                }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>Email</label>
                <input type="email" defaultValue="andres@email.com" disabled style={{
                  padding: '0.8rem', borderRadius: '0.8rem', border: '1px solid var(--border)', backgroundColor: 'var(--muted)'
                }} />
              </div>
              <button style={{
                marginTop: '1rem',
                padding: '1rem',
                borderRadius: 'var(--radius)',
                backgroundColor: 'var(--primary)',
                color: 'white',
                fontWeight: 600,
                width: 'fit-content'
              }}>
                Guardar Cambios
              </button>
            </div>
            
            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
              <button style={{ color: '#d9534f', fontWeight: 600, background: 'none' }}>
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
