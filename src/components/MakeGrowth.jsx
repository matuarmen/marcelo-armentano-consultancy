export default function MakeGrowth() {
    return (
        <section style={{
            position: 'relative',
            minHeight: '600px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '6rem 2rem',
            background: 'linear-gradient(135deg, #3A4A35 0%, #2D3A29 100%)',
            color: 'white',
            borderRadius: 'var(--radius-xl)',
            margin: '0 2rem',
            overflow: 'hidden'
        }}>
            {/* Background Image Placeholder */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'url(https://images.unsplash.com/photo-1560250097-0b93528c311a?w=1200) center/cover',
                opacity: 0.3
            }} />

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
                <h2 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                    marginBottom: '1.5rem',
                    lineHeight: 1.1
                }}>
                    Make <span style={{ fontStyle: 'italic', color: 'var(--color-accent)' }}>Growth</span><br />
                    Effortless
                </h2>

                <p style={{
                    fontSize: '1.1rem',
                    opacity: 0.85,
                    maxWidth: '600px',
                    margin: '0 auto 2rem',
                    lineHeight: 1.6
                }}>
                    Focus on scaling your business while our smart automation handles payments,
                    transfers, and reports — <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>✓ saving you time</span>, reducing errors, and maximizing control.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <a href="#contact" className="btn btn-primary" style={{
                        background: 'var(--color-accent)',
                        color: 'var(--color-primary)'
                    }}>
                        Get Started →
                    </a>
                    <a href="#proceso" className="btn btn-outline" style={{
                        borderColor: 'rgba(255,255,255,0.3)',
                        color: 'white'
                    }}>
                        See how it works
                    </a>
                </div>
            </div>

            {/* Floating "Have a Question" Widget */}
            <div style={{
                position: 'absolute',
                bottom: '2rem',
                right: '3rem',
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: 'var(--radius-lg)',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                fontSize: '0.9rem'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'var(--color-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    🧑‍💼
                </div>
                <div>
                    <strong>Have a Question</strong>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>→</div>
                </div>
            </div>
        </section>
    );
}
