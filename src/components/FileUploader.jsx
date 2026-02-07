import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { extractTextFromPDF } from '../services/pdfParser';

const FileUploader = ({ onResumeParsed }) => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const processFile = async (uploadedFile) => {
        if (uploadedFile.type !== 'application/pdf') {
            setError("Only PDF files are supported.");
            return;
        }

        setFile(uploadedFile);
        setLoading(true);
        setError(null);

        try {
            const text = await extractTextFromPDF(uploadedFile);
            if (text.trim().length < 50) {
                throw new Error("Could not extract enough text. Is it an image-based PDF?");
            }
            onResumeParsed(text, uploadedFile.name);
        } catch (err) {
            setError(err.message);
            setFile(null);
        } finally {
            setLoading(false);
        }
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    return (
        <div className="file-uploader" style={{ width: '100%' }}>
            <form
                className={`glass-panel ${dragActive ? 'drag-active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{
                    padding: 'var(--spacing-xl)',
                    border: dragActive ? '2px solid var(--primary)' : '2px dashed var(--border-color)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    backgroundColor: dragActive ? 'var(--bg-card-hover)' : 'transparent',
                    transition: 'all 0.3s ease'
                }}
            >
                <input
                    type="file"
                    id="input-file-upload"
                    multiple={false}
                    onChange={handleChange}
                    accept=".pdf"
                    style={{
                        position: 'absolute', height: '100%', width: '100%',
                        top: 0, left: 0, opacity: 0, cursor: 'pointer'
                    }}
                />

                <div style={{ pointerEvents: 'none' }}>
                    {loading ? (
                        <>
                            <Loader2 className="spin-slow" size={48} color="var(--primary)" />
                            <h3 style={{ marginTop: 'var(--spacing-md)' }}>Parsing Resume...</h3>
                        </>
                    ) : file ? (
                        <>
                            <CheckCircle size={48} color="var(--accent)" />
                            <h3 style={{ marginTop: 'var(--spacing-md)' }}>{file.name}</h3>
                            <p className="text-muted">Ready for analysis</p>
                        </>
                    ) : (
                        <>
                            <Upload size={48} color="var(--primary)" style={{ opacity: 0.8 }} />
                            <h3 style={{ margin: 'var(--spacing-md) 0' }}>
                                Drag & drop your resume <br />
                                <span style={{ fontSize: '0.9rem', fontWeight: 'normal', color: 'var(--text-muted)' }}>
                                    or click to browse
                                </span>
                            </h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>PDF up to 5MB</p>
                        </>
                    )}

                    {error && (
                        <div style={{ marginTop: 'var(--spacing-md)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <AlertCircle size={16} />
                            <span>{error}</span>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default FileUploader;
