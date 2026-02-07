import React, { useEffect, useState } from 'react';

const ClickSpark = () => {
    const [sparks, setSparks] = useState([]);

    useEffect(() => {
        const handleClick = (e) => {
            const newSpark = {
                id: Date.now(),
                x: e.clientX,
                y: e.clientY,
            };
            setSparks((prev) => [...prev, newSpark]);
            setTimeout(() => {
                setSparks((prev) => prev.filter((s) => s.id !== newSpark.id));
            }, 1000);
        };

        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);

    return (
        <>
            {sparks.map((spark) => (
                <div
                    key={spark.id}
                    className="spark-burst"
                    style={{ top: spark.y, left: spark.x }}
                />
            ))}
        </>
    );
};

export default ClickSpark;
