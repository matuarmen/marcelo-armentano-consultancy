import { useState, useEffect } from 'react';

export default function Navbar({ onContactClick }) {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Check if we're in the Hero section (dark background)
    const isInHero = !scrolled;

    return (
        <header style={{
            position: 'fixed',
            top: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            width: '90%',
            maxWidth: '900px'
        }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.6rem 1.25rem',
                borderRadius: '99px',
                background: isInHero ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(20px)',
                border: isInHero ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.06)',
                boxShadow: isInHero ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 4px 20px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease'
            }}>
                <a href="#home" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: isInHero ? 'white' : 'var(--color-primary)',
                    transition: 'color 0.3s'
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        background: isInHero ? 'linear-gradient(135deg, #3B82F6, #8B5CF6)' : 'var(--color-accent)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.9rem'
                    }}>
                        A
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '1rem' }}>
                        Armentano & ASOC.
                    </span>
                </a>

                <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    {['Servicios', 'Proceso', 'Sobre Mí'].map((item, i) => (
                        <a
                            key={i}
                            href={`#${item.toLowerCase().replace(' ', '-')}`}
                            style={{
                                color: isInHero ? 'rgba(255,255,255,0.7)' : 'var(--color-text-muted)',
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                transition: 'color 0.2s'
                            }}
                        >
                            {item}
                        </a>
                    ))}
                </nav>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <a href="#login" style={{
                        color: isInHero ? 'rgba(255,255,255,0.7)' : 'var(--color-text-muted)',
                        fontSize: '0.9rem',
                        fontWeight: 500
                    }}>
                        Login
                    </a>
                    <button
                        onClick={onContactClick}
                        style={{
                            padding: '0.5rem 1.25rem',
                            borderRadius: '99px',
                            background: isInHero ? 'white' : 'var(--color-primary)',
                            color: isInHero ? '#0A0F1E' : 'white',
                            border: 'none',
                            fontWeight: 600,
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                        }}
                    >
                        Contactar
                    </button>
                </div>
            </div>
        </header>
    );
}
