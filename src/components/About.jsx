export default function About() {
    const academicLogos = [
        { src: "/images/logo-uba.png", alt: "Universidad de Buenos Aires", height: 60 },
        { src: "/images/logo-ucema.png", alt: "UCEMA", height: 35 },
        { src: "/images/logo-iae.png", alt: "IAE Business School", height: 60 },
    ];

    return (
        <section id="about" style={{
            padding: '6rem 0',
            background: 'linear-gradient(180deg, #F5F9FC 0%, #E8F4FC 100%)'
        }}>
            <div className="container">
                <div style={{
                    display: 'grid',
                    gap: '4rem',
                    gridTemplateColumns: '1fr 1.2fr',
                    alignItems: 'center',
                    maxWidth: '1000px',
                    margin: '0 auto'
                }}>
                    {/* Photo */}
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={{
                            width: '280px',
                            height: '280px',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            border: '4px solid white',
                            boxShadow: '0 20px 50px rgba(74, 144, 217, 0.2)'
                        }}>
                            <img
                                src="/images/marcelo-armentano.jpg"
                                alt="Marcelo Armentano"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center top'
                                }}
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div>
                        <div style={{
                            display: 'inline-block',
                            padding: '0.5rem 1rem',
                            borderRadius: 'var(--radius-full)',
                            background: 'rgba(255,255,255,0.8)',
                            color: 'var(--color-text-muted)',
                            fontSize: '0.85rem',
                            fontWeight: 500,
                            marginBottom: '1rem',
                            border: '1px solid rgba(0,0,0,0.06)'
                        }}>
                            Founding Partners
                        </div>

                        <h2 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '2.25rem',
                            color: 'var(--color-primary)',
                            marginBottom: '0.5rem'
                        }}>
                            Marcelo Armentano
                        </h2>

                        <p style={{ color: 'var(--color-accent)', fontWeight: 600, marginBottom: '1.25rem' }}>
                            Consultor Financiero para PYMES | Contador Público | MBA
                        </p>

                        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                            Con más de 20 años de experiencia como CFO, aporto una visión global del negocio, orientación a resultados y un fuerte enfoque en el cliente.
                        </p>

                        <blockquote style={{
                            borderLeft: '3px solid var(--color-accent)',
                            paddingLeft: '1.25rem',
                            fontStyle: 'italic',
                            color: 'var(--color-primary)',
                            fontSize: '1rem',
                            marginBottom: '1.5rem'
                        }}>
                            "Te ayudo a tener la claridad financiera que necesitás para tomar mejores decisiones."
                        </blockquote>

                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                            {academicLogos.map((logo, index) => (
                                <img
                                    key={index}
                                    src={logo.src}
                                    alt={logo.alt}
                                    style={{
                                        height: `${logo.height}px`,
                                        width: 'auto',
                                        objectFit: 'contain',
                                        opacity: 0.6,
                                        filter: 'grayscale(30%)'
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
