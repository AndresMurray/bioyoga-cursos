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
  }, []);  return (
    <div className="animate-fade min-h-[80vh] py-16">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Editorial Premium Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-3 font-serif">
              Hola, {user?.first_name || 'Alumno'} <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="text-lg text-foreground/70 font-medium">
              Bienvenido a tu portal personal de BioYoga Consciente.
            </p>
          </div>
        </header>

        {/* Floating Glassmorphic Tabs Toolbar */}
        <div className="bg-white/40 border border-white/60 p-2 rounded-2xl md:rounded-full flex flex-col md:flex-row gap-2 w-full md:w-fit mb-12 shadow-sm backdrop-blur-md">
          <button 
            onClick={() => setActiveTab('my-courses')}
            className={`flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-xl md:rounded-full font-bold text-sm transition-all duration-300 ${
              activeTab === 'my-courses' 
                ? 'bg-primary text-white shadow-sm scale-102 md:scale-105' 
                : 'text-foreground/80 hover:text-primary hover:bg-white/40'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Mis Cursos
          </button>
          <button 
            onClick={() => setActiveTab('store')}
            className={`flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-xl md:rounded-full font-bold text-sm transition-all duration-300 ${
              activeTab === 'store' 
                ? 'bg-primary text-white shadow-sm scale-102 md:scale-105' 
                : 'text-foreground/80 hover:text-primary hover:bg-white/40'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Explorar Cursos
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-xl md:rounded-full font-bold text-sm transition-all duration-300 ${
              activeTab === 'profile' 
                ? 'bg-primary text-white shadow-sm scale-102 md:scale-105' 
                : 'text-foreground/80 hover:text-primary hover:bg-white/40'
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Mi Perfil
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'my-courses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingMy ? (
              <div className="col-span-full text-center py-16 text-foreground/60 font-medium animate-pulse">
                Cargando tu espacio de cursos...
              </div>
            ) : myCourses.length === 0 ? (
              <div className="col-span-full flex flex-col items-center justify-center py-16 px-6 text-center bg-white/40 border border-white/60 rounded-[2.5rem] rounded-tr-[0.75rem] rounded-bl-[0.75rem] shadow-sm backdrop-blur-md max-w-xl mx-auto animate-fade">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-4xl mb-4 animate-bounce">
                  🧘‍♂️
                </div>
                <h3 className="text-2xl font-bold font-serif mb-2 text-foreground">Tu espacio está listo</h3>
                <p className="text-foreground/70 max-w-sm mb-6 leading-relaxed">Aún no tenés cursos inscriptos en tu cuenta. ¡Explorá nuestros programas para empezar!</p>
                <Button onClick={() => setActiveTab('store')} className="rounded-full font-bold shadow-md px-6">
                  Explorar Catálogo
                </Button>
              </div>
            ) : (
              myCourses.map((course) => (
                <div 
                  key={course.id} 
                  className="group flex flex-col bg-white/50 backdrop-blur-sm border border-white/70 rounded-[2rem] rounded-tr-[0.5rem] rounded-bl-[0.5rem] shadow-sm hover:shadow-md hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
                >
                  <div className="relative h-48 overflow-hidden bg-primary/5 shrink-0">
                    <img 
                      src={course.images[0]?.url || '/images/course-placeholder.png'} 
                      alt={course.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold font-serif mb-3 text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <div className="mb-6 mt-auto">
                      <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
                        Acceso hasta: {new Date(course.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <Link href={`/client/courses/${course.id}`} className="mt-auto">
                      <Button className="w-full font-bold rounded-full shadow-md">
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
              <div className="text-center py-16 text-foreground/60 font-medium animate-pulse">
                Explorando catálogo de clases...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {storeCourses
                  .filter(course => !myCourses.some(myCourse => myCourse.id === course.id))
                  .map((course) => (
                    <CourseCard 
                      key={course.id}
                      course={course}
                    />
                  ))}
                {storeCourses.filter(course => !myCourses.some(myCourse => myCourse.id === course.id)).length === 0 && (
                  <div className="col-span-full flex flex-col items-center justify-center py-16 px-6 text-center bg-white/40 border border-white/60 rounded-[2.5rem] rounded-tr-[0.75rem] rounded-bl-[0.75rem] shadow-sm backdrop-blur-md max-w-xl mx-auto animate-fade">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-4xl mb-4 animate-bounce">
                      ✨
                    </div>
                    <h3 className="text-2xl font-bold font-serif mb-2 text-foreground">¡Estás al día!</h3>
                    <p className="text-foreground/70 max-w-sm leading-relaxed">
                      Ya estás inscripto en todos los cursos y talleres disponibles actualmente en BioYoga.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto bg-white/50 backdrop-blur-md rounded-[2.5rem] rounded-tr-[0.75rem] rounded-bl-[0.75rem] border border-white/70 p-8 md:p-10 shadow-sm animate-fade">
            <h3 className="text-2xl font-bold font-serif mb-6 text-foreground">Información de la Cuenta</h3>
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-foreground/80">Nombre Completo</label>
                <input 
                  type="text" 
                  defaultValue={user ? `${user.first_name} ${user.last_name}` : ''} 
                  disabled 
                  className="w-full px-4 py-3 rounded-2xl border border-white/60 bg-white/30 backdrop-blur-sm text-foreground/60 font-medium cursor-not-allowed outline-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-foreground/80">Correo Electrónico</label>
                <input 
                  type="email" 
                  defaultValue={user?.email || ''} 
                  disabled 
                  className="w-full px-4 py-3 rounded-2xl border border-white/60 bg-white/30 backdrop-blur-sm text-foreground/60 font-medium cursor-not-allowed outline-none"
                />
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/60">
              <h3 className="text-xl font-bold font-serif mb-4 text-foreground">Cambiar Contraseña</h3>
              
              {pwdSuccess && (
                <div className="mb-4 p-4 bg-green-500/10 text-green-800 border border-green-500/20 rounded-2xl text-sm font-medium animate-fade">
                  ✨ {pwdSuccess}
                </div>
              )}
              {pwdError && (
                <div className="mb-4 p-4 bg-red-500/10 text-red-800 border border-red-500/20 rounded-2xl text-sm font-medium animate-fade">
                  ⚠️ {pwdError}
                </div>
              )}

              <form onSubmit={handlePasswordChange} className="flex flex-col gap-5">
                <Input 
                  label="Contraseña Actual" 
                  type="password" 
                  value={pwdData.current}
                  onChange={(e) => setPwdData(p => ({ ...p, current: e.target.value }))}
                  required
                  className="bg-white/60 backdrop-blur-sm border-white/60 rounded-xl focus:ring-primary/20 focus:border-primary"
                />
                <Input 
                  label="Nueva Contraseña" 
                  type="password" 
                  value={pwdData.newPwd}
                  onChange={(e) => setPwdData(p => ({ ...p, newPwd: e.target.value }))}
                  required
                  className="bg-white/60 backdrop-blur-sm border-white/60 rounded-xl focus:ring-primary/20 focus:border-primary"
                />
                <Button type="submit" disabled={isChangingPwd} className="w-fit mt-2 rounded-full font-bold px-6 py-2.5 shadow-md">
                  {isChangingPwd ? 'Guardando...' : 'Cambiar Contraseña'}
                </Button>
              </form>
            </div>

            <div className="mt-8 pt-6 border-t border-white/60 flex justify-end">
              <button 
                onClick={logout} 
                className="text-red-500 hover:text-red-700 font-bold transition-colors text-sm bg-transparent border-0 cursor-pointer flex items-center gap-1.5"
              >
                ✕ Cerrar Sesión
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
              className="w-full rounded-full font-bold"
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
