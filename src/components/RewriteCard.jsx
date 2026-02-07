import React from 'react';
import { ArrowRight, X, Check } from 'lucide-react';

const RewriteCard = ({ original, improved, reason }) => {
    return (
        <div className="glass-panel" style={{ marginBottom: 'var(--spacing-md)', padding: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                {/* Before */}
                <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, color: '#ef4444' }}>
                        <X size={20} />
                    </div>
                    <p style={{ color: 'var(--text-muted)', textDecoration: 'line-through', opacity: 0.7 }}>
                        "{original}"
                    </p>
                </div>

                {/* Arrow on desktop, spacer on mobile */}
                {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ArrowRight className="text-muted" />
            </div> */}

                {/* After */}
                <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, color: '#22c55e' }}>
                        <Check size={20} />
                    </div>
                    <p style={{ color: 'white', fontWeight: '500' }}>
                        "{improved}"
                    </p>
                </div>

                <div style={{ marginTop: '0.5rem', paddingLeft: '2rem', fontSize: '0.85rem', color: 'var(--primary)', fontStyle: 'italic' }}>
                    <strong>Why:</strong> {reason}
                </div>
            </div>
        </div>
    );
};

export default RewriteCard;
