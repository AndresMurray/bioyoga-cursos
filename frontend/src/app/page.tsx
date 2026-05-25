import React from 'react';
import CourseCard from '@/components/courses/CourseCard';
import RedirectIfLoggedIn from '@/components/auth/RedirectIfLoggedIn';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Course } from '@/hooks/useCourses';
import WhatsAppButton from '@/components/common/WhatsAppButton';

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
    hero_title: "",
    hero_subtitle_1: "",
    hero_subtitle_2: "",
    hero_image_url: "",
    whatsapp_number: ""
  };

  return (
    <>
      <WhatsAppButton phoneNumber={heroData.whatsapp_number} />
      <div className="animate-fade">
        <RedirectIfLoggedIn />

        {/* Hero Section / Presentation */}
        <section id="sobre-mi" className="py-20 md:py-28 bg-gradient-to-b from-[#faf7f2] to-[#f4efea] flex flex-col items-center">
          <div className="container max-w-4xl text-center px-4">
            <h1 className="font-sans text-4xl md:text-6xl font-black leading-tight mb-8 text-[#3d312a] tracking-tight max-w-3xl mx-auto uppercase">
              {heroData.hero_title}
            </h1>

            {/* Circular Frame with Offset Shadow */}
            <div className="relative w-72 h-72 md:w-80 md:h-80 mx-auto mb-10">
              <div className="zen-circle-frame w-full h-full overflow-hidden border-4 border-white">
                {(!heroData.hero_image_url || heroData.hero_image_url.trim() === "") ? (
                  <div className="w-full h-full bg-muted/20 flex flex-col items-center justify-center text-center p-8 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-accent/5 opacity-50"></div>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-primary/70">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                ) : (
                  <img
                    src={heroData.hero_image_url}
                    alt="Instructora de Yoga"
                    className="w-full h-full object-cover block"
                  />
                )}
              </div>
            </div>

            <p className="text-base md:text-lg text-muted-foreground mb-6 leading-relaxed max-w-2xl mx-auto">
              {heroData.hero_subtitle_1}
            </p>
            <p className="text-base md:text-lg text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
              {heroData.hero_subtitle_2}
            </p>

            <div className="flex justify-center">
              <a href="#cursos">
                <Button size="lg" className="rounded-full shadow-lg shadow-primary/30 text-base px-8 py-6 font-semibold bg-primary hover:bg-primary/95 text-white transition-all transform hover:scale-[1.02]">
                  Ver Cursos y Talleres
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section id="cursos" className="py-24 bg-[#faf7f2]">
          <div className="container">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <div className="lotus-divider mb-8"></div>
              <h2 className="text-4xl font-black mb-4 text-[#3d312a] uppercase tracking-tight">Nuestros Cursos y Talleres</h2>
              <p className="text-lg text-muted-foreground">
                Capacitaciones diseñadas para profundizar tu práctica personal y potenciar tu camino en el mundo del yoga y el bienestar.
              </p>
            </div>

            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center p-12 bg-muted rounded-[2.5rem] border border-border">
                <span className="text-4xl block mb-4">📚</span>
                <h3 className="text-xl font-bold mb-2">Próximamente nuevos cursos</h3>
                <p className="text-muted-foreground">Actualmente estamos preparando nuevo contenido. ¡Mantenete atento!</p>
              </div>
            )}
          </div>
        </section>

        {/* Call to action */}
        <section className="py-24 bg-gradient-to-b from-[#faf7f2] to-[#f4efea]">
          <div className="container">
            <div className="bg-[#b9d8c8]/40 rounded-[3rem] rounded-tr-[1rem] rounded-bl-[1rem] p-12 md:p-20 text-center flex flex-col items-center border border-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#6c9e9b]/15 rounded-full blur-3xl -ml-20 -mb-20"></div>

              <h2 className="text-3xl md:text-5xl font-black mb-4 text-[#3d312a] uppercase tracking-tight relative z-10">
                ¿Listo para empezar tu viaje?
              </h2>
              <p className="text-lg mb-8 max-w-xl text-[#3d312a]/80 relative z-10 leading-relaxed">
                Únete a nuestra escuela online de BioYoga y accede a formaciones y prácticas diseñadas para habitar tu cuerpo en plenitud.
              </p>
              <Link href="/register" className="relative z-10">
                <Button size="lg" className="rounded-full shadow-xl shadow-primary/30 text-base px-10 py-6 bg-primary hover:bg-primary/95 text-white font-semibold">
                  Crear una cuenta gratis
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
