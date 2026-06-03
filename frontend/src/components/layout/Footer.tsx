import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#2e4234', /* Warm Pine Forest Green */
      padding: '5rem 0 3rem 0',
      marginTop: '6rem',
      borderTopLeftRadius: '3.5rem',
      borderTopRightRadius: '3.5rem',
      boxShadow: '0 -15px 30px -10px rgba(46, 66, 52, 0.15)',
      color: '#faf7f2'
    }}>
      <div className="container px-4">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '4rem'
        }}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <img 
                src="/logo-sin-fondo.png" 
                alt="BioYoga Consciente" 
                className="h-11 w-11 object-contain" 
              />
              <span className="font-sans text-2xl font-bold tracking-tight text-[#faf7f2]">BioYoga</span>
            </div>
            <p style={{ color: '#c5d5cb', fontSize: '0.9rem', lineHeight: '1.6' }}>
              Espacio dedicado a la formación profesional en yoga, meditación y bienestar consciente.
            </p>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1.5rem', fontWeight: 600, color: '#faf7f2', letterSpacing: '0.05em' }}>Enlaces</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <li><a href="#" style={{ color: '#c5d5cb', transition: 'color 0.2s' }} className="hover:text-white">Inicio</a></li>
              <li><a href="#cursos" style={{ color: '#c5d5cb', transition: 'color 0.2s' }} className="hover:text-white">Cursos</a></li>
              <li><a href="#sobre-mi" style={{ color: '#c5d5cb', transition: 'color 0.2s' }} className="hover:text-white">Sobre Mí</a></li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1.5rem', fontWeight: 600, color: '#faf7f2', letterSpacing: '0.05em' }}>Contacto</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.9rem', color: '#c5d5cb' }}>
              <li className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8bbab7] mb-0.5">Dirección</span>
                <span>Calle 54 nro 3640 (7630) Necochea</span>
              </li>
              <li className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8bbab7] mb-0.5">Email</span>
                <a href="mailto:bioyogaconsciente@gmail.com" className="hover:text-white transition-colors">
                  bioyogaconsciente@gmail.com
                </a>
              </li>
              <li className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8bbab7] mb-0.5">Teléfono</span>
                <a href="tel:+5492262498757" className="hover:text-white transition-colors">
                  +54 9 2262-498757
                </a>
              </li>
              <li style={{ marginTop: '0.5rem' }}>
                <a 
                  href="https://instagram.com/bioyogaconscienteok" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    color: '#8bbab7',
                    fontWeight: '600'
                  }}
                  className="hover:text-[#b7dada] transition-colors"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  Instagram: @bioyogaconscienteok
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          paddingTop: '2.5rem',
          textAlign: 'center',
          color: '#c5d5cb',
          fontSize: '0.85rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          alignItems: 'center'
        }}>
          <span>© {new Date().getFullYear()} BioYoga Consciente. Todos los derechos reservados.</span>
          <span style={{ fontSize: '0.8rem', color: '#a3bdae' }}>
            Desarrollado por <strong style={{ color: '#faf7f2' }}>Andrés Murray Roppel</strong> | Contacto: <a href="mailto:amurrayroppel@gmail.com" style={{ textDecoration: 'underline', color: '#8bbab7' }} className="hover:text-white transition-colors">amurrayroppel@gmail.com</a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
