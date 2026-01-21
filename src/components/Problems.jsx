import { CheckCircle } from 'lucide-react';

export default function Problems() {
    const problems = [
        "Falta de visión financiera clara para la toma de decisiones.",
        "Rentabilidad desconocida o peligrosamente baja.",
        "Costos desordenados o fuera de control.",
        "Ausencia de información clave para la gestión del negocio.",
        "Búsqueda de financiamiento sin una preparación adecuada.",
        "Carencia de presupuestos, proyecciones y reportes de gestión.",
    ];

    return (
        <section id="problems" style={{
            padding: '6rem 0',
            background: 'linear-gradient(180deg, #D6EAF8 0%, #F5F9FC 100%)'
        }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '0.5rem 1.25rem',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(255,255,255,0.8)',
                        color: 'var(--color-text-muted)',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        marginBottom: '1rem',
                        border: '1px solid rgba(0,0,0,0.06)'
                    }}>
                        Nuestra Experiencia
                    </div>
                    <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2rem, 5vw, 3rem)',
                        color: 'var(--color-primary)',
                        marginBottom: '1rem'
                    }}>
                        Resolvemos los Desafíos Financieros<br />de tu <span style={{ fontStyle: 'italic', color: '#C9A227' }}>PYME</span>
                    </h2>
                    <p style={{
                        color: 'var(--color-text-muted)',
                        fontSize: '1.1rem',
                        maxWidth: '700px',
                        margin: '0 auto',
                        lineHeight: 1.6
                    }}>
                        Entendemos los obstáculos que impiden tu crecimiento. Nuestro enfoque está en convertir estos problemas en oportunidades de mejora sostenible.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1rem',
                    maxWidth: '900px',
                    margin: '0 auto'
                }}>
                    {problems.map((problem, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            gap: '1rem',
                            alignItems: 'start',
                            padding: '1.25rem 1.5rem',
                            background: 'rgba(255,255,255,0.7)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 'var(--radius-lg)',
                            border: '1px solid rgba(0,0,0,0.04)'
                        }}>
                            <CheckCircle size={20} color="#C9A227" style={{ marginTop: '2px', flexShrink: 0 }} />
                            <p style={{ color: 'var(--color-text)', fontSize: '0.95rem', lineHeight: 1.5 }}>{problem}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
