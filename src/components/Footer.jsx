import { Mail, Phone, Linkedin, ArrowRight } from 'lucide-react';

export default function Footer({ onContactClick }) {
    return (
        <footer style={{
            background: '#0F172A',
            borderRadius: '40px 40px 0 0',
            marginTop: '-20px',
            overflow: 'hidden'
        }}>
            {/* Main Contact Section */}
            <div style={{ padding: '5rem 0 4rem' }}>
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 1fr',
                        gap: '4rem',
                        alignItems: 'center'
                    }}>
                        {/* Left Column - Contact Info */}
                        <div>
                            <h2 style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                                marginBottom: '1.25rem',
                                lineHeight: 1.2,
                                color: 'white'
                            }}>
                                ¿Listo para dar el <span style={{ fontStyle: 'italic', color: '#60A5FA' }}>siguiente paso</span>?
                            </h2>

                            <p style={{
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: '1.05rem',
                                lineHeight: 1.6,
                                marginBottom: '2rem',
                                maxWidth: '450px'
                            }}>
                                Solicitá una reunión inicial sin costo para conocer el servicio y evaluar cómo puedo ayudarte.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <a href="mailto:marcelorarmentano@gmail.com" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    color: 'rgba(255,255,255,0.7)',
                                    fontSize: '1rem',
                                    transition: 'color 0.2s'
                                }}>
                                    <Mail size={20} color="#60A5FA" />
                                    marcelorarmentano@gmail.com
                                </a>
                                <a href="https://wa.me/541157213363" target="_blank" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    color: 'rgba(255,255,255,0.7)',
                                    fontSize: '1rem'
                                }}>
                                    <Phone size={20} color="#60A5FA" />
                                    +54 11 5721 3363
                                </a>
                                <a href="#" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    color: 'rgba(255,255,255,0.7)',
                                    fontSize: '1rem'
                                }}>
                                    <Linkedin size={20} color="#60A5FA" />
                                    LinkedIn
                                </a>
                            </div>
                        </div>

                        {/* Right Column - CTA Card */}
                        <div style={{
                            background: 'rgba(255,255,255,0.95)',
                            borderRadius: '28px',
                            padding: '2.5rem',
                            textAlign: 'center',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.3)'
                        }}>
                            <h3 style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '1.5rem',
                                color: '#0F172A',
                                marginBottom: '0.5rem'
                            }}>
                                Agenda una consulta gratuita
                            </h3>
                            <p style={{ color: '#5C6B7A', marginBottom: '1.5rem' }}>
                                Descubre el potencial financiero de tu empresa.
                            </p>
                            <button
                                onClick={onContactClick}
                                style={{
                                    width: '100%',
                                    padding: '1rem 2rem',
                                    fontSize: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    background: '#0F172A',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '99px',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                Contactar <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Credits */}
            <div style={{
                background: '#0F172A',
                padding: '1.5rem 0',
                borderTop: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div className="container" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
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
                        <span style={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>
                            Armentano & ASOC.
                        </span>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>
                        © {new Date().getFullYear()} ARMENTANO & ASOC. Todos los derechos reservados.
                    </p>

                    <nav style={{ display: 'flex', gap: '1.5rem' }}>
                        <a href="#" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Términos</a>
                        <a href="#" style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>Privacidad</a>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
