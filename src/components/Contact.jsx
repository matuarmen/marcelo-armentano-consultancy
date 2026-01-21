import { Mail, Phone, Linkedin, ArrowRight } from 'lucide-react';

export default function Contact({ onContactClick }) {
    return (
        <section id="contact" style={{
            padding: '6rem 0',
            background: 'linear-gradient(180deg, #E8F4FC 0%, #D6EAF8 100%)'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '3rem',
                    alignItems: 'center',
                    maxWidth: '1000px',
                    margin: '0 auto'
                }}>
                    {/* Left Column */}
                    <div>
                        <h2 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: 'clamp(2rem, 4vw, 2.5rem)',
                            marginBottom: '1.25rem',
                            lineHeight: 1.2,
                            color: 'var(--color-primary)'
                        }}>
                            ¿Listo para dar el <span style={{ fontStyle: 'italic', color: 'var(--color-accent)' }}>siguiente paso</span>?
                        </h2>

                        <p style={{
                            color: 'var(--color-text-muted)',
                            fontSize: '1rem',
                            lineHeight: 1.6,
                            marginBottom: '1.5rem'
                        }}>
                            Solicitá una reunión inicial sin costo para conocer el servicio y evaluar cómo puedo ayudarte.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <a href="mailto:marcelorarmentano@gmail.com" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                color: 'var(--color-text-muted)',
                                fontSize: '0.95rem'
                            }}>
                                <Mail size={18} color="var(--color-accent)" />
                                marcelorarmentano@gmail.com
                            </a>
                            <a href="https://wa.me/541157213363" target="_blank" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                color: 'var(--color-text-muted)',
                                fontSize: '0.95rem'
                            }}>
                                <Phone size={18} color="var(--color-accent)" />
                                +54 11 5721 3363
                            </a>
                            <a href="#" style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                color: 'var(--color-text-muted)',
                                fontSize: '0.95rem'
                            }}>
                                <Linkedin size={18} color="var(--color-accent)" />
                                LinkedIn
                            </a>
                        </div>
                    </div>

                    {/* Right Column - CTA Card */}
                    <div className="bento-card" style={{
                        padding: '2.5rem',
                        textAlign: 'center',
                        background: 'rgba(255,255,255,0.9)'
                    }}>
                        <h3 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '1.5rem',
                            color: 'var(--color-primary)',
                            marginBottom: '0.5rem'
                        }}>
                            Agenda una consulta gratuita
                        </h3>
                        <p style={{ color: 'var(--color-text-muted)', marginBottom: '1.5rem' }}>
                            Descubre el potencial financiero de tu empresa.
                        </p>
                        <button
                            onClick={onContactClick}
                            className="btn btn-primary"
                            style={{
                                width: '100%',
                                padding: '1rem',
                                fontSize: '1rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            Contactar <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
