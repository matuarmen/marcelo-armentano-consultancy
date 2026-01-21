import { TrendingUp } from 'lucide-react';
import Threads from './Threads';

export default function Hero() {
    return (
        <section id="home" style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            padding: '8rem 2rem 4rem',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #0A0F1E 0%, #0F172A 50%, #1E1B4B 100%)'
        }}>
            {/* Threads Background */}
            <Threads color={[0.32, 0.15, 1]} amplitude={1.2} />

            <div className="container" style={{
                position: 'relative',
                zIndex: 1,
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '4rem',
                alignItems: 'center'
            }}>
                {/* Left Column - Text */}
                <div>
                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2.8rem, 5vw, 4.5rem)',
                        lineHeight: 1.1,
                        color: 'white',
                        marginBottom: '1.5rem'
                    }}>
                        Transformando la Gestión Financiera <span style={{ fontStyle: 'italic', color: '#60A5FA' }}>con Estrategia e IA</span>
                    </h1>

                    <p style={{
                        fontSize: '1.15rem',
                        color: 'rgba(255,255,255,0.7)',
                        marginBottom: '2.5rem',
                        lineHeight: 1.7,
                        maxWidth: '550px'
                    }}>
                        Ayudamos a PYMES en Argentina y LATAM a optimizar procesos, mejorar la rentabilidad y tomar decisiones estratégicas con total claridad financiera.
                    </p>

                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <a href="#contact" style={{
                            padding: '1rem 2rem',
                            borderRadius: '99px',
                            background: 'white',
                            color: '#0A0F1E',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '1rem',
                            transition: 'transform 0.2s'
                        }}>
                            Agendar Reunión
                        </a>
                        <a href="#services" style={{
                            color: 'rgba(255,255,255,0.8)',
                            textDecoration: 'none',
                            fontSize: '1rem',
                            fontWeight: 500,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            Conocer más
                        </a>
                    </div>
                </div>

                {/* Right Column - Revenue Card */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <div style={{
                        background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '24px',
                        padding: '2rem',
                        border: '1px solid rgba(255,255,255,0.1)',
                        minWidth: '280px',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <TrendingUp size={18} color="#60A5FA" />
                            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Revenue</span>
                            <div style={{ marginLeft: 'auto', display: 'flex', gap: '4px' }}>
                                <span style={{ width: '6px', height: '6px', background: '#60A5FA', borderRadius: '50%' }} />
                                <span style={{ width: '6px', height: '6px', background: 'rgba(255,255,255,0.3)', borderRadius: '50%' }} />
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '2.75rem', fontWeight: 700, color: 'white' }}>$10,629</span>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Last 30 days</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <span style={{
                                padding: '0.4rem 0.75rem',
                                background: 'rgba(34,197,94,0.15)',
                                color: '#4ADE80',
                                borderRadius: '8px',
                                fontSize: '0.85rem',
                                fontWeight: 600
                            }}>
                                +26%
                            </span>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>Since previous 30 days</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Floating Elements */}
            <div style={{
                position: 'absolute',
                bottom: '2rem',
                left: '2rem',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                zIndex: 1
            }}>
                SCROLL <span style={{ fontSize: '1.2rem' }}>↓</span>
            </div>

            <div style={{
                position: 'absolute',
                bottom: '2rem',
                right: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                zIndex: 1
            }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                    Trabajamos con +20 empresas
                </span>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    background: 'rgba(255,255,255,0.1)',
                    padding: '0.5rem 1rem',
                    borderRadius: '99px',
                    backdropFilter: 'blur(10px)'
                }}>
                    <div style={{ display: 'flex' }}>
                        {['👨‍💼', '👩‍💼', '👨‍💻'].map((e, i) => (
                            <span key={i} style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: '#1E293B',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginLeft: i > 0 ? '-8px' : 0,
                                border: '2px solid #0A0F1E',
                                fontSize: '0.9rem'
                            }}>{e}</span>
                        ))}
                    </div>
                    <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 500 }}>Finance experts</span>
                </div>
            </div>
        </section>
    );
}
