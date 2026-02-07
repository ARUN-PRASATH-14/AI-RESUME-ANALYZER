import React, { useEffect, useState } from 'react';

const ScoreMeter = ({ score, label, color = "var(--primary)" }) => {
    const [displayScore, setDisplayScore] = useState(0);
    const radius = 60;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (displayScore / 100) * circumference;

    useEffect(() => {
        let startTime;
        const duration = 1500;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);

            setDisplayScore(Math.floor(easeOutQuart * score));

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [score]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '140px', height: '140px' }}>
                <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }}>
                    {/* Background Circle */}
                    <circle
                        cx="70" cy="70" r={radius}
                        stroke="var(--border-color)"
                        strokeWidth="10"
                        fill="transparent"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx="70" cy="70" r={radius}
                        stroke={color}
                        strokeWidth="10"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                    />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: '800', color: 'white' }}>{displayScore}</span>
                </div>
            </div>
            <span style={{ marginTop: 'var(--spacing-md)', color: 'white', fontSize: '1rem', fontWeight: '600' }}>
                {label}
            </span>
        </div>
    );
};

export default ScoreMeter;
