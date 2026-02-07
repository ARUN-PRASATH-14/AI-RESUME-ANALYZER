import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';

const FeedbackSection = ({ title, name, score, feedback, improvements }) => {
    console.log("FeedbackSection Props:", { title, name, score });
    const sectionTitle = title || name || "Untitled Section";
    const [isOpen, setIsOpen] = useState(false);
    const [displayScore, setDisplayScore] = useState(0);

    // Animate score on load
    React.useEffect(() => {
        let startTime;
        const duration = 1000;
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            setDisplayScore(Math.floor(progress * score));
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [score]);

    const getScoreColor = (s) => {
        if (s >= 80) return '#22c55e'; // Green
        if (s >= 60) return '#eab308'; // Yellow
        return '#ef4444'; // Red
    };

    return (
        <div className="glass-panel" style={{ marginBottom: 'var(--spacing-md)', overflow: 'hidden', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    background: isOpen ? 'rgba(255,255,255,0.05)' : 'transparent',
                    transition: 'background 0.3s'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {/* Centered Score Circle */}
                    <div style={{
                        position: 'relative',
                        width: '50px', height: '50px', borderRadius: '50%',
                        background: `conic-gradient(${getScoreColor(score)} ${score}%, rgba(255,255,255,0.1) ${score}%)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: `0 0 10px ${getScoreColor(score)}40`
                    }}>
                        {/* Inner circle to create donut chart */}
                        <div style={{
                            position: 'absolute', width: '42px', height: '42px',
                            background: '#0f172a', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'white' }}>{displayScore}</span>
                        </div>
                    </div>

                    <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#ffffff', fontWeight: '700', letterSpacing: '0.5px' }}>{sectionTitle}</h3>
                </div>
                {isOpen ? <ChevronUp size={24} color="rgba(255,255,255,0.7)" /> : <ChevronDown size={24} color="rgba(255,255,255,0.7)" />}
            </div>

            {isOpen && (
                <div className="animate-enter" style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
                    <p style={{ color: '#e2e8f0', marginBottom: '1.5rem', fontSize: '1.05rem', lineHeight: '1.7' }}>{feedback}</p>

                    {improvements && improvements.length > 0 && (
                        <div style={{ background: 'rgba(249, 115, 22, 0.1)', padding: '1.5rem', borderRadius: '0.75rem', borderLeft: '4px solid #f97316' }}>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#fb923c', marginBottom: '1rem', fontSize: '1.1rem' }}>
                                <Lightbulb size={20} /> Suggested Improvements
                            </h4>
                            <ul style={{ paddingLeft: '1.5rem', color: '#fed7aa' }}>
                                {improvements.map((imp, i) => (
                                    <li key={i} style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>{imp}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default FeedbackSection;
