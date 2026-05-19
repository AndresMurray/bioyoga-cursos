import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--muted)',
      padding: '4rem 0 2rem 0',
      marginTop: '4rem',
      borderTop: '1px solid var(--border)'
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          <div>
            <h3 style={{ color: 'var(--primary)', marginBottom: '1.5rem' }}>CENTRA</h3>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
              Espacio dedicado a la kinesiología y la formación profesional con calidez y excelencia.
            </p>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1.2rem' }}>Enlaces</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <li><a href="#" style={{ color: 'var(--muted-foreground)' }}>Inicio</a></li>
              <li><a href="#" style={{ color: 'var(--muted-foreground)' }}>Cursos</a></li>
              <li><a href="#" style={{ color: 'var(--muted-foreground)' }}>Sobre Mí</a></li>
            </ul>
          </div>
          
          <div>
            <h4 style={{ marginBottom: '1.2rem' }}>Contacto</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'var(--muted-foreground)' }}>
              <li>Dirección: Necochea, Buenos Aires, Argentina</li>
              <li style={{ marginTop: '0.5rem' }}>
                <a 
                  href="https://instagram.com/metodo.centra" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    color: 'var(--primary)',
                    fontWeight: '500'
                  }}
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  Seguinos: @metodo.centra
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div style={{
          borderTop: '1px solid var(--border)',
          paddingTop: '2rem',
          textAlign: 'center',
          color: 'var(--muted-foreground)',
          fontSize: '0.8rem'
        }}>
          © {new Date().getFullYear()} Centra Kinesiología. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
