import React from 'react';
import CourseCard from '@/components/courses/CourseCard';
import RedirectIfLoggedIn from '@/components/auth/RedirectIfLoggedIn';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Course } from '@/hooks/useCourses';

async function getVisibleCourses(): Promise<Course[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const res = await fetch(`${apiUrl}/courses?visible_only=true`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

async function getHomeConfig() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const res = await fetch(`${apiUrl}/home-config`, { cache: 'no-store' });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error fetching home config:', error);
    return null;
  }
}

export default async function Home() {
  const [courses, homeConfig] = await Promise.all([
    getVisibleCourses(),
    getHomeConfig()
  ]);

  // Fallback values in case config is not yet set
  const heroData = homeConfig || {
    hero_title: "Pasión por el movimiento y la salud",
    hero_subtitle_1: "Hola, soy Lic. en Kinesiología. Mi objetivo es ayudarte a recuperar tu bienestar a través de técnicas innovadoras y un trato cercano y profesional.",
    hero_subtitle_2: "En este espacio no solo brindo atención personalizada, sino que también comparto mis conocimientos a través de cursos especializados para profesionales y estudiantes del área.",
    hero_image_url: "/images/kinesiologist.png"
  };

  return (
    <div className="animate-fade">
      <RedirectIfLoggedIn />
      
      {/* Hero Section / Presentation */}
      <section id="sobre-mi" className="py-24 bg-background min-h-[80vh] flex items-center">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-accent rounded-2xl -z-10 transform -rotate-2"></div>
            <img 
              src={heroData.hero_image_url} 
              alt="Kinesióloga" 
              className="w-full rounded-xl shadow-2xl block"
            />
          </div>
          <div>
            <span className="text-primary font-semibold uppercase tracking-[0.2em] text-sm block mb-4">
              Sobre Mí
            </span>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 text-foreground">
              {heroData.hero_title}
            </h1>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {heroData.hero_subtitle_1}
            </p>
            <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
              {heroData.hero_subtitle_2}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#cursos">
                <Button size="lg" className="shadow-lg shadow-primary/30 text-base px-8">
                  Ver Cursos
                </Button>
              </a>
              <a href="#">
                <Button variant="outline" size="lg" className="text-base px-8">
                  Contactar
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="cursos" className="py-24 bg-white">
        <div className="container">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Nuestros Cursos</h2>
            <p className="text-lg text-muted-foreground">
              Capacitaciones diseñadas para potenciar tu carrera profesional con las últimas tendencias en kinesiología y fisiatría.
            </p>
          </div>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center p-12 bg-muted rounded-2xl border border-border">
              <span className="text-4xl block mb-4">📚</span>
              <h3 className="text-xl font-bold mb-2">Próximamente nuevos cursos</h3>
              <p className="text-muted-foreground">Actualmente estamos preparando nuevo contenido. ¡Mantenete atento!</p>
            </div>
          )}
        </div>
      </section>

      {/* Call to action */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="bg-secondary rounded-3xl p-12 md:p-20 text-center flex flex-col items-center shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary-foreground relative z-10">
              ¿Listo para empezar?
            </h2>
            <p className="text-lg mb-8 max-w-xl text-secondary-foreground/80 relative z-10">
              Únete a nuestra plataforma y accede a contenido exclusivo diseñado por expertos.
            </p>
            <Link href="/register" className="relative z-10">
              <Button size="lg" className="shadow-xl shadow-primary/40 text-base px-10 py-6">
                Crear una cuenta gratis
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
