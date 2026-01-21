import { useState } from 'react';

export default function FAQ() {
    const faqs = [
        { q: "1. ¿Cómo funciona la plataforma?", a: "Conectas tus datos financieros en un solo lugar y usás IA para retroalimentar decisiones." },
        { q: "2. ¿Es seguro mi información?", a: "Sí, usamos encriptación de grado bancario y cumplimos con regulaciones internacionales." },
        { q: "3. ¿Qué tipo de soporte ofrecen?", a: "Soporte 24/7 vía chat, email y WhatsApp." },
        { q: "4. ¿Puedo cancelar en cualquier momento?", a: "Sí, sin penalidades. Tus datos te pertenecen." },
    ];

    const [open, setOpen] = useState(null);

    return (
        <section id="faq" style={{ padding: '6rem 0', background: 'var(--color-bg)' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem', alignItems: 'start' }}>
                    <div>
                        <h2 style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: '3rem',
                            color: 'var(--color-primary)',
                            marginBottom: '1rem'
                        }}>
                            Frequently Asked<br /><span style={{ fontStyle: 'italic', color: 'var(--color-accent)' }}>Questions</span>
                        </h2>
                        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                            Everything you need to know about managing your finances smarter.
                            Explore how our platform simplifies financial operations and gives you real-time visibility.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {faqs.map((faq, i) => (
                            <div
                                key={i}
                                onClick={() => setOpen(open === i ? null : i)}
                                style={{
                                    background: 'white',
                                    borderRadius: 'var(--radius-md)',
                                    padding: '1.25rem 1.5rem',
                                    cursor: 'pointer',
                                    border: '1px solid var(--color-border)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <strong style={{ color: 'var(--color-primary)' }}>{faq.q}</strong>
                                    <span style={{
                                        fontSize: '1.5rem',
                                        color: 'var(--color-text-muted)',
                                        transform: open === i ? 'rotate(45deg)' : 'none',
                                        transition: 'transform 0.2s'
                                    }}>+</span>
                                </div>
                                {open === i && (
                                    <p style={{ marginTop: '1rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                                        {faq.a}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
