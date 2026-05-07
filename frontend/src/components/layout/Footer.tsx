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
              <li>Email: contacto@centra.com</li>
              <li>WhatsApp: +54 9 11 1234-5678</li>
              <li>Dirección: Buenos Aires, Argentina</li>
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
