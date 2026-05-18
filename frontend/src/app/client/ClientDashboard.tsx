'use client';

import React, { useState, useEffect } from 'react';
import CourseCard from '@/components/courses/CourseCard';
import { useMyCourses } from '@/hooks/useMyCourses';
import { useCourses } from '@/hooks/useCourses';
import { useAuth } from '@/hooks/useAuth';
import { useHomeConfig } from '@/hooks/useHomeConfig';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import PurchaseConfirmationModal from '@/components/courses/PurchaseConfirmationModal';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/Input';

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState<'my-courses' | 'store' | 'profile'>('my-courses');
  const { user, logout } = useAuth();
  const { courses: myCourses, loading: loadingMy, fetchMyCourses } = useMyCourses();
  const { courses: storeCourses, loading: loadingStore, fetchCourses } = useCourses();
  const { config, fetchConfig } = useHomeConfig();

  // Pending purchase modal state (from login-then-buy flow)
  const [pendingPurchaseTitle, setPendingPurchaseTitle] = useState<string | null>(null);
  const [pendingAlreadyOwned, setPendingAlreadyOwned] = useState(false);

  // Change password state
  const [pwdData, setPwdData] = useState({ current: '', newPwd: '' });
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [isChangingPwd, setIsChangingPwd] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');
    if (pwdData.newPwd.length < 6) {
      setPwdError('La nueva contraseña debe tener al menos 6 caracteres.');
      return;
    }
    setIsChangingPwd(true);
    try {
      const response = await api.post('/auth/change-password', {
        current_password: pwdData.current,
        new_password: pwdData.newPwd
      });
      setPwdSuccess(response.message || 'Contraseña actualizada.');
      setPwdData({ current: '', newPwd: '' });
    } catch (err: any) {
      setPwdError(err.message || 'Error al cambiar contraseña.');
    } finally {
      setIsChangingPwd(false);
    }
  };

  useEffect(() => {
    fetchMyCourses();
    fetchCourses(true); // only visible
    fetchConfig();
  }, [fetchMyCourses, fetchCourses, fetchConfig]);

  // Check for pending purchase from sessionStorage (login-then-buy flow)
  useEffect(() => {
    const raw = sessionStorage.getItem('pendingPurchase');
    if (raw) {
      sessionStorage.removeItem('pendingPurchase');
      try {
        const data = JSON.parse(raw);
        setPendingPurchaseTitle(data.courseTitle);
        setPendingAlreadyOwned(data.alreadyOwned);
      } catch {}
    }
  }, []);

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
            {loadingMy ? (
              <div className="text-center py-12 text-muted-foreground italic">Cargando tus cursos...</div>
            ) : myCourses.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground italic">
                Aún no tienes cursos asignados. ¡Explora nuestra tienda!
              </div>
            ) : (
              myCourses.map((course) => (
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
                      <Badge variant="secondary">
                        Acceso hasta: {new Date(course.end_date).toLocaleDateString()}
                      </Badge>
                    </div>
                    
                    <Link href={`/client/courses/${course.id}`} className="mt-auto">
                      <Button className="w-full font-semibold">
                        Ingresar al Curso
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'store' && (
          <div>
            {loadingStore ? (
              <div className="text-center py-12 text-muted-foreground italic">Cargando cursos...</div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {storeCourses
                  .filter(course => !myCourses.some(myCourse => myCourse.id === course.id))
                  .map((course) => (
                  <CourseCard 
                    key={course.id}
                    course={course}
                  />
                ))}
              </div>
            )}
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
                <input type="text" defaultValue={user ? `${user.first_name} ${user.last_name}` : ''} disabled style={{
                  padding: '0.8rem', borderRadius: '0.8rem', border: '1px solid var(--border)', backgroundColor: 'var(--muted)'
                }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--muted-foreground)' }}>Email</label>
                <input type="email" defaultValue={user?.email || ''} disabled style={{
                  padding: '0.8rem', borderRadius: '0.8rem', border: '1px solid var(--border)', backgroundColor: 'var(--muted)'
                }} />
              </div>
            </div>
            
            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
              <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', fontWeight: 600 }}>Cambiar Contraseña</h3>
              
              {pwdSuccess && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
                  {pwdSuccess}
                </div>
              )}
              {pwdError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
                  {pwdError}
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
                <Input 
                  label="Contraseña Actual" 
                  type="password" 
                  value={pwdData.current}
                  onChange={(e) => setPwdData(p => ({ ...p, current: e.target.value }))}
                  required
                />
                <Input 
                  label="Nueva Contraseña" 
                  type="password" 
                  value={pwdData.newPwd}
                  onChange={(e) => setPwdData(p => ({ ...p, newPwd: e.target.value }))}
                  required
                />
                <Button type="submit" disabled={isChangingPwd} className="w-fit mt-2">
                  {isChangingPwd ? 'Guardando...' : 'Cambiar Contraseña'}
                </Button>
              </form>
            </div>

            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
              <button onClick={logout} style={{ color: '#d9534f', fontWeight: 600, background: 'none' }}>
                Cerrar Sesión
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Pending purchase modals (from login-then-buy flow) */}
      {pendingPurchaseTitle && !pendingAlreadyOwned && (
        <PurchaseConfirmationModal
          isOpen={true}
          onClose={() => setPendingPurchaseTitle(null)}
          whatsappNumber={config?.whatsapp_number || ''}
          courseTitle={pendingPurchaseTitle}
        />
      )}

      {pendingPurchaseTitle && pendingAlreadyOwned && (
        <Modal isOpen={true} onClose={() => setPendingPurchaseTitle(null)} className="max-w-md p-8">
          <div className="flex flex-col items-center text-center">
            <div className="text-5xl mb-5">✅</div>
            <h3 className="text-2xl font-bold text-primary mb-4">¡Ya tenés este curso!</h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Ya tenés comprado el curso <strong className="text-foreground">{pendingPurchaseTitle}</strong>. Accedé al mismo desde <strong className="text-foreground">Mis Cursos</strong>.
            </p>
            <Button
              onClick={() => { setPendingPurchaseTitle(null); setActiveTab('my-courses'); }}
              className="w-full"
            >
              Ir a Mis Cursos
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ClientDashboard;
