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

        {/* Hero Section / Presentation — Editorial Split Layout */}
        <section id="sobre-mi" className="relative py-20 md:py-28 overflow-hidden">
          {/* Decorative background blobs */}
          <div className="hero-blob w-[500px] h-[500px] -top-40 -right-40 absolute opacity-60"></div>
          <div className="hero-blob w-[300px] h-[300px] bottom-10 -left-20 absolute opacity-40" style={{ animationDelay: '-4s' }}></div>
          
          <div className="container max-w-6xl mx-auto px-4">
            <div className="flex flex-col-reverse md:flex-row items-center gap-12 md:gap-16 lg:gap-20">
              
              {/* Left: Text Content */}
              <div className="flex-1 text-center md:text-left">
                {/* Small decorative accent */}
                <div className="animate-slide-up flex items-center gap-3 mb-6 justify-center md:justify-start">
                  <span className="block w-8 h-[3px] rounded-full bg-[#8bbab7]"></span>
                  <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#6c9e9b]">BioYoga Consciente</span>
                </div>
                
                <h1 className="animate-slide-up animate-slide-up-delay-1 font-sans text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] mb-8 text-[#3d312a] tracking-tight max-w-xl">
                  {heroData.hero_title}
                </h1>

                <p className="animate-slide-up animate-slide-up-delay-2 text-base md:text-lg text-muted-foreground mb-5 leading-relaxed max-w-lg">
                  {heroData.hero_subtitle_1}
                </p>
                <p className="animate-slide-up animate-slide-up-delay-3 text-base md:text-lg text-muted-foreground mb-10 leading-relaxed max-w-lg">
                  {heroData.hero_subtitle_2}
                </p>

                <div className="animate-slide-up animate-slide-up-delay-4 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                  <a href="#cursos">
                    <Button size="lg" className="rounded-full shadow-lg shadow-primary/30 text-base px-8 py-6 font-semibold bg-primary hover:bg-primary/95 text-white transition-all transform hover:scale-[1.02]">
                      Ver Cursos y Talleres
                    </Button>
                  </a>
                </div>
              </div>

              {/* Right: Profile Image with Decorative Elements */}
              <div className="relative flex-shrink-0 flex items-center justify-center">
                {/* Decorative ring behind the image */}
                <div className="absolute w-80 h-80 md:w-[22rem] md:h-[22rem] rounded-full border-2 border-dashed border-[#8bbab7]/20 animate-[spin_40s_linear_infinite]"></div>
                
                {/* Main floating image container */}
                <div className="animate-float relative w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80">
                  <div className="zen-circle-frame animate-glow-pulse w-full h-full overflow-hidden border-4 border-white">
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

                  {/* Decorative small floating dots */}
                  <div className="absolute -top-4 -right-4 w-3 h-3 rounded-full bg-[#d99b82]/60 animate-float" style={{ animationDelay: '-2s' }}></div>
                  <div className="absolute -bottom-2 -left-6 w-2 h-2 rounded-full bg-[#8bbab7]/70 animate-float" style={{ animationDelay: '-4s' }}></div>
                  <div className="absolute top-1/2 -right-8 w-2 h-2 rounded-full bg-[#4a6b53]/40 animate-float" style={{ animationDelay: '-1s' }}></div>
                </div>
              </div>
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
