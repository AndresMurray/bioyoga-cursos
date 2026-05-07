'use client';

import React, { useState } from 'react';
import CourseCard from '@/components/courses/CourseCard';

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState<'my-courses' | 'store' | 'profile'>('my-courses');

  const myCourses = [
    {
      title: "Kinesiología Deportiva Avanzada",
      image: "/images/course1.png",
      progress: 65,
      lastAccessed: "2024-05-01"
    }
  ];

  const availableCourses = [
    {
      title: "Rehabilitación Post-Quirúrgica",
      image: "/images/course1.png",
      description: "Protocolos actualizados para la rehabilitación de cirugías de rodilla, cadera y columna.",
      price: "$12.500"
    },
    {
      title: "Vendaje Neuromuscular Pro",
      image: "/images/course1.png",
      description: "Domina las aplicaciones de taping para diferentes patologías.",
      price: "$9.800"
    }
  ];

  return (
    <div className="animate-fade" style={{ minHeight: '80vh', padding: '4rem 0' }}>
      <div className="container">
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Hola, Andrés 👋</h1>
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
            {myCourses.map((course, i) => (
              <div key={i} style={{
                backgroundColor: 'white',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                overflow: 'hidden'
              }}>
                <img src={course.image} alt={course.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ marginBottom: '1rem' }}>{course.title}</h3>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                      <span>Progreso</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div style={{ height: '8px', backgroundColor: 'var(--muted)', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${course.progress}%`, height: '100%', backgroundColor: 'var(--primary)' }}></div>
                    </div>
                  </div>
                  <button style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '0.8rem',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    fontWeight: 600
                  }}>
                    Continuar Aprendiendo
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'store' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {availableCourses.map((course, i) => (
              <CourseCard 
                key={i}
                title={course.title}
                image={course.image}
                description={course.description}
                price={course.price}
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
