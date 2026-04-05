import { BrainCircuit, Briefcase, BarChart, Target } from 'lucide-react';

export default function Services() {
    const services = [
        {
            icon: <Briefcase size={28} />,
            title: "CFO Part-Time",
            description: "Acompañamiento mensual estratégico con foco en métricas clave.",
        },
        {
            icon: <BarChart size={28} />,
            title: "Diagnóstico Financiero Express",
            description: "Evaluación rápida del estado financiero de tu empresa.",
        },
        {
            icon: <Target size={28} />,
            title: "Proyectos Especiales",
            description: "Tableros de control, presupuestos y evaluación de inversiones.",
        },
        {
            icon: <BrainCircuit size={28} />,
            title: "Inteligencia Artificial para Finanzas",
            description: "Optimización de procesos y toma de decisiones mediante IA generativa.",
        },
    ];

    return (
        <section id="services" style={{
            padding: '6rem 0',
            background: 'linear-gradient(180deg, #F5F9FC 0%, #FFFFFF 100%)'
        }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2rem, 5vw, 3rem)',
                        color: 'var(--color-primary)',
                        marginBottom: '1rem'
                    }}>
                        Servicios a tu <span style={{ fontStyle: 'italic', color: 'var(--color-accent)' }}>Medida</span>
                    </h2>
                    <p style={{
                        color: 'var(--color-text-muted)',
                        fontSize: '1.1rem',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: 1.6
                    }}>
                        Soluciones flexibles para cada etapa de tu negocio.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '1.5rem',
                    maxWidth: '900px',
                    margin: '0 auto'
                }}>
                    {services.map((service, index) => (
                        <div key={index} className="bento-card" style={{
                            display: 'flex',
                            gap: '1.25rem',
                            padding: '1.75rem'
                        }}>
                            <div style={{
                                width: '56px',
                                height: '56px',
                                background: 'linear-gradient(135deg, rgba(74, 144, 217, 0.15), rgba(74, 144, 217, 0.05))',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--color-accent)',
                                flexShrink: 0
                            }}>
                                {service.icon}
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.1rem', color: 'var(--color-primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                                    {service.title}
                                </h3>
                                <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.5, fontSize: '0.9rem' }}>
                                    {service.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
