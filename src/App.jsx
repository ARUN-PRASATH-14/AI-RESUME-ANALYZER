import React, { useState } from 'react';
import { Download, Upload, ShieldCheck, Sparkles, Settings, ArrowLeft, Loader2 } from 'lucide-react';
import FileUploader from './components/FileUploader';
import ScoreMeter from './components/ScoreMeter';
import FeedbackSection from './components/FeedbackSection';
import RewriteCard from './components/RewriteCard';
import ClickSpark from './components/ClickSpark';
import { analyzeResume } from './services/gemini';

function App() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const [analyzing, setAnalyzing] = useState(false);
    const [results, setResults] = useState(null);
    const [resumeText, setResumeText] = useState(null);
    const [resumeName, setResumeName] = useState(null);
    const [portfolioUrl, setPortfolioUrl] = useState('');
    const [error, setError] = useState(null);

    const handleResumeParsed = (text, fileName) => {
        setResumeText(text);
        setResumeName(fileName);
        setError(null);
    };

    const startAnalysis = async () => {
        if (!resumeText && !portfolioUrl) {
            setError("Please upload a resume OR provide a portfolio URL.");
            return;
        }
        if (!apiKey) {
            setError("API Key is missing in .env file.");
            return;
        }

        setAnalyzing(true);
        setError(null);

        try {
            const data = await analyzeResume(resumeText, portfolioUrl, apiKey);
            setResults(data);
        } catch (err) {
            setError(err.message || "An error occurred during analysis.");
        } finally {
            setAnalyzing(false);
        }
    };

    const resetAnalysis = () => {
        setResults(null);
        setResumeText(null);
        setResumeName(null);
        setError(null);
        setPortfolioUrl('');
    };

    return (
        <div className="container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <ClickSpark />
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-xl)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <Sparkles className="text-gradient" size={32} />
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '800' }}>ResumeAI</h1>
                </div>
            </header>

            <main style={{ flex: 1, paddingBottom: '4rem' }}>
                {results ? (
                    <div className="animate-enter">
                        <button
                            onClick={resetAnalysis}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}
                        >
                            <ArrowLeft size={20} /> Upload New Resume
                        </button>

                        {/* Score Section */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', marginBottom: '3rem', justifyContent: 'center' }}>
                            <div className="glass-panel" style={{ padding: '2rem', flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <ScoreMeter score={results.score} label="Overall ATS Score" />
                            </div>

                            <div className="glass-panel" style={{ padding: '2rem', flex: 2, minWidth: '300px' }}>
                                <h2 style={{ marginBottom: '1rem' }}>Recruiter's Perspective</h2>
                                <blockquote style={{ borderLeft: '4px solid var(--accent)', paddingLeft: '1rem', fontStyle: 'italic', fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
                                    "{results.persona_feedback}"
                                </blockquote>
                                <p style={{ color: 'var(--text-muted)' }}>{results.summary}</p>
                            </div>
                        </div>

                        {/* Feedback Sections */}
                        <h2 style={{ marginBottom: '1.5rem' }}>Section Analysis</h2>
                        <div style={{ marginBottom: '3rem' }}>
                            {results.sections?.map((section, index) => (
                                <FeedbackSection key={index} {...section} />
                            ))}
                        </div>

                        {/* Rewrites */}
                        <h2 style={{ marginBottom: '1.5rem' }}>Smart Rewrites</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {results.rewrites?.map((rewrite, index) => (
                                <RewriteCard key={index} {...rewrite} />
                            ))}
                        </div>

                    </div>
                ) : (
                    <div className="animate-enter" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: 'var(--spacing-md)' }}>
                            See your resume <br />
                            <span className="text-gradient">the way recruiters do.</span>
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: 'var(--spacing-xl)', maxWidth: '600px' }}>
                            Upload your resume and portfolio to get AI-driven scoring, bullet point rewrites, and industry-specific feedback.
                        </p>

                        <div className="glass-panel" style={{ padding: 'var(--spacing-xl)', width: '100%', maxWidth: '800px', margin: '0 auto' }}>

                            {!resumeText ? (
                                <FileUploader onResumeParsed={handleResumeParsed} />
                            ) : (
                                <div style={{ textAlign: 'center', padding: '2rem' }}>
                                    <div style={{
                                        width: '64px', height: '64px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e',
                                        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
                                    }}>
                                        <ShieldCheck size={32} />
                                    </div>
                                    <h3 style={{ marginBottom: '0.5rem' }}>{resumeName}</h3>
                                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Resume uploaded successfully.</p>
                                    <button
                                        onClick={() => setResumeText(null)}
                                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', textDecoration: 'underline' }}
                                    >
                                        Replace File
                                    </button>
                                </div>
                            )}

                            <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'left' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Portfolio / LinkedIn URL (Optional)</label>
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    value={portfolioUrl}
                                    onChange={(e) => setPortfolioUrl(e.target.value)}
                                    className="glass-panel"
                                    style={{
                                        width: '100%', padding: '1rem', color: 'white',
                                        background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '0.5rem'
                                    }}
                                />
                            </div>

                            <button
                                className="btn-primary"
                                onClick={startAnalysis}
                                disabled={analyzing || (!resumeText && !portfolioUrl)}
                                style={{
                                    marginTop: 'var(--spacing-lg)', width: '100%',
                                    opacity: (analyzing || (!resumeText && !portfolioUrl)) ? 0.5 : 1,
                                    cursor: (analyzing || (!resumeText && !portfolioUrl)) ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                                }}
                            >
                                {analyzing ? (
                                    <>
                                        <Loader2 className="spin-slow" size={20} /> Analyzing with Ai Engine...
                                    </>
                                ) : (
                                    <>
                                        <Sparkles size={20} /> Analyze Profile
                                    </>
                                )}
                            </button>
                        </div>
                        {error && (
                            <div style={{ marginTop: '1rem', color: '#ef4444', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem' }}>
                                {error}
                            </div>
                        )}
                    </div>
                )}
            </main>

            <footer style={{ marginTop: 'var(--spacing-xl)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <p>Powered by <a href="https://www.linkedin.com/in/arun-prasath-c-107898272/" target="_blank" rel="noopener noreferrer">Ai Engine</a></p>
            </footer>
        </div>
    );
}

export default App;
