import React from 'react';
import CourseCard from '@/components/courses/CourseCard';

export default function Home() {
  const courses = [
    {
      title: "Kinesiología Deportiva Avanzada",
      image: "/images/course1.png",
      description: "Aprende las técnicas más modernas para la recuperación de atletas de alto rendimiento. Este curso cubre desde la evaluación inicial hasta el retorno al campo.",
      price: "$15.000"
    },
    {
      title: "Rehabilitación Post-Quirúrgica",
      image: "/images/course1.png",
      description: "Protocolos actualizados para la rehabilitación de cirugías de rodilla, cadera y columna. Enfocado en la evidencia científica actual.",
      price: "$12.500"
    },
    {
      title: "Vendaje Neuromuscular Pro",
      image: "/images/course1.png",
      description: "Domina las aplicaciones de taping para diferentes patologías músculo-esqueléticas y mejora el rendimiento de tus pacientes.",
      price: "$9.800"
    }
  ];

  return (
    <div className="animate-fade">
      {/* Hero Section / Presentation */}
      <section id="sobre-mi" style={{ 
        padding: '6rem 0', 
        backgroundColor: 'var(--background)',
        display: 'flex',
        alignItems: 'center',
        minHeight: '80vh'
      }}>
        <div className="container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '4rem',
          alignItems: 'center'
        }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute',
              top: '-20px',
              left: '-20px',
              width: '100%',
              height: '100%',
              backgroundColor: 'var(--accent)',
              borderRadius: 'var(--radius)',
              zIndex: -1
            }}></div>
            <img 
              src="/images/kinesiologist.png" 
              alt="Kinesióloga" 
              style={{
                width: '100%',
                borderRadius: 'var(--radius)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                display: 'block'
              }}
            />
          </div>
          <div>
            <span style={{ 
              color: 'var(--primary)', 
              fontWeight: 600, 
              textTransform: 'uppercase', 
              letterSpacing: '2px',
              fontSize: '0.9rem',
              display: 'block',
              marginBottom: '1rem'
            }}>
              Sobre Mí
            </span>
            <h1 style={{ fontSize: '3rem', lineHeight: '1.1', marginBottom: '1.5rem' }}>
              Pasión por el movimiento y la salud
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--muted-foreground)', marginBottom: '2rem' }}>
              Hola, soy Lic. en Kinesiología. Mi objetivo es ayudarte a recuperar tu bienestar a través de técnicas innovadoras y un trato cercano y profesional.
            </p>
            <p style={{ fontSize: '1.1rem', color: 'var(--muted-foreground)', marginBottom: '2.5rem' }}>
              En este espacio no solo brindo atención personalizada, sino que también comparto mis conocimientos a través de cursos especializados para profesionales y estudiantes del área.
            </p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="#cursos" style={{
                padding: '1rem 2rem',
                borderRadius: 'var(--radius)',
                backgroundColor: 'var(--primary)',
                color: 'white',
                fontWeight: 600,
                boxShadow: '0 4px 14px 0 rgba(248, 180, 166, 0.39)'
              }}>
                Ver Cursos
              </a>
              <a href="#" style={{
                padding: '1rem 2rem',
                borderRadius: 'var(--radius)',
                backgroundColor: 'white',
                border: '1px solid var(--border)',
                fontWeight: 600
              }}>
                Contactar
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section id="cursos" style={{ padding: '6rem 0', backgroundColor: 'white' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Nuestros Cursos</h2>
            <p style={{ color: 'var(--muted-foreground)', maxWidth: '600px', margin: '0 auto' }}>
              Capacitaciones diseñadas para potenciar tu carrera profesional con las últimas tendencias en kinesiología y fisiatría.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.5rem'
          }}>
            {courses.map((course, index) => (
              <CourseCard 
                key={index}
                title={course.title}
                image={course.image}
                description={course.description}
                price={course.price}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--background)' }}>
        <div className="container">
          <div style={{
            backgroundColor: 'var(--secondary)',
            borderRadius: '2rem',
            padding: '4rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}>
            <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>¿Listo para empezar?</h2>
            <p style={{ marginBottom: '2rem', maxWidth: '500px' }}>
              Únete a nuestra plataforma y accede a contenido exclusivo diseñado por expertos.
            </p>
            <button style={{
              padding: '1rem 2.5rem',
              borderRadius: 'var(--radius)',
              backgroundColor: 'var(--primary)',
              color: 'white',
              fontWeight: 600,
              boxShadow: '0 4px 14px 0 rgba(248, 180, 166, 0.39)'
            }}>
              Crear una cuenta gratis
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
