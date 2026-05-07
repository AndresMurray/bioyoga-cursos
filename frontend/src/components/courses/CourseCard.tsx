'use client';

import React, { useState } from 'react';

interface CourseProps {
  title: string;
  image: string;
  description: string;
  price: string;
}

const CourseCard = ({ title, image, description, price }: CourseProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div 
        onClick={() => setShowModal(true)}
        className="animate-fade"
        style={{
          backgroundColor: 'white',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          cursor: 'pointer',
          transition: 'transform 0.3s ease',
          border: '1px solid var(--border)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
      >
        <div style={{ height: '200px', overflow: 'hidden' }}>
          <img src={image} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{title}</h3>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            {description.substring(0, 80)}...
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>{price}</span>
            <button style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              backgroundColor: 'var(--accent)',
              color: 'var(--accent-foreground)',
              fontSize: '0.8rem',
              fontWeight: 600
            }}>
              Ver más
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(74, 63, 53, 0.4)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100,
          backdropFilter: 'blur(4px)'
        }} onClick={() => setShowModal(false)}>
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: 'var(--radius)',
              width: '90%',
              maxWidth: '500px',
              overflow: 'hidden',
              animation: 'fadeIn 0.3s ease forwards'
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            <img src={image} alt={title} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem' }}>{title}</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  style={{ background: 'none', fontSize: '1.5rem', color: 'var(--muted-foreground)' }}
                >
                  ×
                </button>
              </div>
              <p style={{ color: 'var(--muted-foreground)', marginBottom: '2rem' }}>
                {description}
              </p>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Inversión</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{price}</span>
                </div>
                <button style={{
                  flex: 2,
                  padding: '1rem',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'var(--primary)',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '1rem',
                  boxShadow: '0 4px 14px 0 rgba(248, 180, 166, 0.39)'
                }}>
                  Comprar Curso
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseCard;
