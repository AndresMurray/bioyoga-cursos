'use client';

import React, { useState } from 'react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'content' | 'users'>('content');
  
  // Mock data for users
  const [users, setUsers] = useState([
    { id: 1, name: "Andrés Murray", email: "andres@email.com", activeCourses: ["Kinesiología Deportiva Avanzada"] },
    { id: 2, name: "Lucía Pérez", email: "lucia@email.com", activeCourses: [] },
  ]);

  const [courses] = useState([
    "Kinesiología Deportiva Avanzada",
    "Rehabilitación Post-Quirúrgica",
    "Vendaje Neuromuscular Pro"
  ]);

  return (
    <div className="animate-fade" style={{ minHeight: '80vh', padding: '4rem 0' }}>
      <div className="container">
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Panel de Administración 🔐</h1>
          <p style={{ color: 'var(--muted-foreground)' }}>Gestiona el contenido y los alumnos de Centra.</p>
        </header>

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          borderBottom: '1px solid var(--border)',
          marginBottom: '3rem'
        }}>
          <button 
            onClick={() => setActiveTab('content')}
            style={{
              padding: '1rem 0',
              borderBottom: activeTab === 'content' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'content' ? 'var(--primary)' : 'var(--muted-foreground)',
              fontWeight: 600,
              backgroundColor: 'transparent'
            }}
          >
            Contenido Home
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            style={{
              padding: '1rem 0',
              borderBottom: activeTab === 'users' ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === 'users' ? 'var(--primary)' : 'var(--muted-foreground)',
              fontWeight: 600,
              backgroundColor: 'transparent'
            }}
          >
            Gestión de Alumnos
          </button>
        </div>

        {activeTab === 'content' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '2rem', 
              borderRadius: 'var(--radius)', 
              border: '1px solid var(--border)' 
            }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Presentación Home</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Título Hero</label>
                  <input type="text" defaultValue="Pasión por el movimiento y la salud" style={{
                    padding: '0.8rem', borderRadius: '0.8rem', border: '1px solid var(--border)'
                  }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Descripción Sobre Mí</label>
                  <textarea rows={6} defaultValue="Hola, soy Lic. en Kinesiología. Mi objetivo es ayudarte a recuperar tu bienestar a través de técnicas innovadoras..." style={{
                    padding: '0.8rem', borderRadius: '0.8rem', border: '1px solid var(--border)', fontFamily: 'inherit'
                  }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: 500 }}>Imagen de Perfil (URL)</label>
                  <input type="text" defaultValue="/images/kinesiologist.png" style={{
                    padding: '0.8rem', borderRadius: '0.8rem', border: '1px solid var(--border)'
                  }} />
                </div>
                <button style={{
                  padding: '1rem',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  fontWeight: 600
                }}>
                  Actualizar Home
                </button>
              </div>
            </div>

            <div style={{ 
              backgroundColor: 'white', 
              padding: '2rem', 
              borderRadius: 'var(--radius)', 
              border: '1px solid var(--border)' 
            }}>
              <h3 style={{ marginBottom: '1.5rem' }}>Gestión de Cursos (Visibilidad)</h3>
              <p style={{ color: 'var(--muted-foreground)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Selecciona qué cursos aparecen en la tienda pública.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {courses.map((course, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid var(--border)', borderRadius: '0.8rem' }}>
                    <span style={{ fontWeight: 500 }}>{course}</span>
                    <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px', accentColor: 'var(--primary)' }} />
                  </div>
                ))}
                <button style={{
                  marginTop: '1rem',
                  padding: '1rem',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'white',
                  border: '1px solid var(--primary)',
                  color: 'var(--primary)',
                  fontWeight: 600
                }}>
                  Agregar Nuevo Curso
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: 'var(--radius)', 
            border: '1px solid var(--border)', 
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ backgroundColor: 'var(--muted)' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '1.5rem', fontSize: '0.9rem' }}>Alumno</th>
                  <th style={{ textAlign: 'left', padding: '1.5rem', fontSize: '0.9rem' }}>Cursos Activos</th>
                  <th style={{ textAlign: 'right', padding: '1.5rem', fontSize: '0.9rem' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderTop: '1px solid var(--border)' }}>
                    <td style={{ padding: '1.5rem' }}>
                      <div style={{ fontWeight: 600 }}>{user.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>{user.email}</div>
                    </td>
                    <td style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {user.activeCourses.length > 0 ? user.activeCourses.map((c, i) => (
                          <span key={i} style={{ 
                            fontSize: '0.7rem', 
                            padding: '0.3rem 0.6rem', 
                            backgroundColor: 'var(--accent)', 
                            color: 'var(--accent-foreground)',
                            borderRadius: '2rem',
                            fontWeight: 600
                          }}>{c}</span>
                        )) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Ninguno</span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                      <button style={{
                        padding: '0.6rem 1.2rem',
                        borderRadius: '0.6rem',
                        backgroundColor: 'var(--secondary)',
                        color: 'var(--secondary-foreground)',
                        fontWeight: 600,
                        fontSize: '0.8rem'
                      }}>
                        Gestionar Accesos
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
