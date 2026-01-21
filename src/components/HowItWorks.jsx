export default function HowItWorks() {
    const steps = [
        {
            step: "01",
            title: "Diagnóstico Personalizado",
            description: "Análisis profundo de los desafíos y oportunidades únicas de tu negocio.",
        },
        {
            step: "02",
            title: "Plan de Acción Estratégico",
            description: "Plan a medida con objetivos claros y acciones concretas.",
        },
        {
            step: "03",
            title: "Implementación y Seguimiento",
            description: "Reuniones periódicas e informes claros orientados a la decisión.",
        },
    ];

    return (
        <section id="how-it-works" style={{
            padding: '6rem 0',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F5F9FC 100%)'
        }}>
            <div className="container">
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(2rem, 5vw, 3rem)',
                        color: 'var(--color-primary)',
                        marginBottom: '1rem'
                    }}>
                        Nuestro <span style={{ fontStyle: 'italic', color: 'var(--color-accent)' }}>Proceso</span>
                    </h2>
                    <p style={{
                        color: 'var(--color-text-muted)',
                        fontSize: '1.1rem',
                        maxWidth: '600px',
                        margin: '0 auto',
                        lineHeight: 1.6
                    }}>
                        Un método claro y colaborativo para garantizar resultados.
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '2rem',
                    maxWidth: '1000px',
                    margin: '0 auto'
                }}>
                    {steps.map((item, index) => (
                        <div key={item.step} className="bento-card" style={{ textAlign: 'center', padding: '2rem' }}>
                            <div style={{
                                fontSize: '3rem',
                                fontWeight: 800,
                                fontFamily: 'var(--font-display)',
                                color: 'rgba(74, 144, 217, 0.2)',
                                lineHeight: 1,
                                marginBottom: '1rem'
                            }}>
                                {item.step}
                            </div>
                            <h3 style={{
                                fontSize: '1.15rem',
                                fontWeight: 600,
                                color: 'var(--color-primary)',
                                marginBottom: '0.75rem'
                            }}>
                                {item.title}
                            </h3>
                            <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.5, fontSize: '0.9rem' }}>
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
