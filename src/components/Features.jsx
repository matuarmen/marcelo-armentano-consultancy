export default function Features() {
    return (
        <section id="servicios" style={{ padding: '6rem 0', background: 'var(--color-bg)' }}>
            <div className="container">

                {/* Bento Grid - Feature Section 1 */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr',
                    gap: '1.5rem',
                    marginBottom: '4rem'
                }}>
                    {/* Image Card */}
                    <div style={{
                        gridRow: '1 / 3',
                        borderRadius: 'var(--radius-xl)',
                        overflow: 'hidden',
                        position: 'relative',
                        minHeight: '400px',
                        background: 'linear-gradient(135deg, #CBD5C0, #A8B49E)'
                    }}>
                        <div style={{
                            position: 'absolute',
                            bottom: '1.5rem',
                            left: '1.5rem',
                            right: '1.5rem',
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '1.25rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                <span style={{ fontSize: '1.2rem' }}>✓</span>
                                <strong>Empower your financial decisions</strong>
                            </div>
                            <p style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                                Stay in control of every transaction and account with tools built for smarter.
                            </p>
                        </div>
                    </div>

                    {/* Feature Pills */}
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <FeaturePill icon="📊" title="Visual analytics hub" />
                        <FeaturePill icon="⚙️" title="Automated expense control">
                            <div style={{
                                background: 'var(--color-accent)',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                fontSize: '0.8rem',
                                marginTop: '0.75rem'
                            }}>
                                <div style={{ fontSize: '0.7rem', marginBottom: '0.25rem' }}>Budget Limit Alert</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Marketing Budget</span>
                                    <span>72%</span>
                                </div>
                            </div>
                        </FeaturePill>
                        <FeaturePill icon="🔄" title="Unified account system" />
                    </div>

                    {/* Benefits List */}
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                            <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
                                Manage every account, transaction, and insight from one <strong>powerful dashboard</strong>.
                                Get a real-time view of your entire financial ecosystem.
                            </p>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '2rem' }}>
                            <BenefitBadge text="Real-time spend alerts" />
                            <BenefitBadge text="Clear visual analytics dashboard" filled />
                            <BenefitBadge text="Multi-account management" />
                            <BenefitBadge text="Smart automation for daily reporting" />
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', alignItems: 'center' }}>
                            <a href="#contact" className="btn btn-primary" style={{ padding: '0.625rem 1.25rem' }}>View Demo →</a>
                            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>📞 24/7 <strong>support</strong></span>
                        </div>
                    </div>
                </div>

                {/* Smarter Finance Section */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1.2fr 1fr',
                    gap: '1.5rem',
                    alignItems: 'center'
                }}>
                    <div>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-primary)' }}>
                            Smarter finance,<br />one clear view.
                        </h2>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <a href="#" className="btn btn-primary" style={{ padding: '0.625rem 1.25rem' }}>View Demo →</a>
                            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>📞 24/7 support</span>
                        </div>
                        <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                            <strong style={{ color: 'var(--color-text)' }}>Gain full visibility into</strong> your financial flow, track spending, income, and cash in real time.
                        </p>
                        <p style={{ color: 'var(--color-text-muted)', marginTop: '1rem', lineHeight: 1.6 }}>
                            <strong style={{ color: 'var(--color-text)' }}>Automate manual work and</strong> simplify reporting through intelligent automation, saving hours every week.
                        </p>
                    </div>

                    {/* Stats Card */}
                    <div className="card" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Transactions tracked</span>
                            <span className="badge" style={{ background: 'var(--color-accent)', padding: '0.25rem 0.75rem' }}>Last week</span>
                        </div>
                        <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--color-primary)' }}>1,523</div>
                        <div style={{ display: 'flex', alignItems: 'end', gap: '0.5rem', marginTop: '1rem', height: '80px' }}>
                            {[30, 45, 35, 60, 50, 75, 55].map((h, i) => (
                                <div key={i} style={{
                                    flex: 1,
                                    height: `${h}%`,
                                    background: i === 6 ? 'var(--color-primary)' : 'var(--color-bg)',
                                    borderRadius: '4px'
                                }} />
                            ))}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#22c55e', marginTop: '0.5rem' }}>↑ +12.4%</div>
                    </div>

                    {/* Revenue Card */}
                    <div style={{
                        background: 'var(--color-primary)',
                        borderRadius: 'var(--radius-xl)',
                        padding: '2rem',
                        color: 'white',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '150px',
                            height: '150px',
                            border: '4px solid var(--color-accent)',
                            borderRadius: '50%',
                            borderTopColor: 'transparent',
                            animation: 'spin 2s linear infinite'
                        }} />
                        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>$129,000</div>
                            <div style={{
                                display: 'inline-block',
                                background: 'var(--color-accent)',
                                color: 'var(--color-primary)',
                                padding: '0.25rem 0.75rem',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.8rem',
                                fontWeight: 600
                            }}>Revenue Managed</div>
                        </div>
                        <p style={{ marginTop: '2rem', fontSize: '0.9rem', lineHeight: 1.5, opacity: 0.8, textAlign: 'center' }}>
                            Support that scales with your growth
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

// Sub-components
function FeaturePill({ icon, title, children }) {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{icon}</span>
                <strong style={{ color: 'var(--color-primary)' }}>{title}</strong>
            </div>
            {children}
        </div>
    );
}

function BenefitBadge({ text, filled }) {
    return (
        <span style={{
            display: 'inline-block',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.85rem',
            background: filled ? 'var(--color-primary)' : 'transparent',
            color: filled ? 'white' : 'var(--color-text-muted)',
            border: filled ? 'none' : '1px solid var(--color-border)'
        }}>
            {text}
        </span>
    );
}
