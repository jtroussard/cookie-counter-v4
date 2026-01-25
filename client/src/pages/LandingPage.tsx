import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';

const LandingPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (loginError) {
            setError(loginError.message);
            setLoading(false);
        } else {
            navigate('/test');
        }
    };

    return (
        <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="card shadow-sm p-4" style={{ maxWidth: '400px', width: '100%', borderRadius: '20px' }}>
                <div className="text-center mb-5">
                    <h1 className="display-4 text-primary mb-0" style={{ fontFamily: 'serif', fontWeight: 'bold' }}>
                        Cookie Counter
                    </h1>
                    <h2 className="h4 text-primary" style={{ fontFamily: 'serif' }}>v4.0</h2>
                </div>

                <form onSubmit={handleLogin}>
                    {error && <div className="alert alert-danger p-2 small">{error}</div>}

                    <div className="mb-4">
                        <label className="form-label text-muted small text-uppercase tracking-wider fw-bold">Email</label>
                        <input
                            type="email"
                            className="form-control form-control-lg border-0 bg-secondary bg-opacity-10 text-center"
                            placeholder="hello@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{ borderRadius: '10px' }}
                        />
                    </div>

                    <div className="mb-5">
                        <label className="form-label text-muted small text-uppercase tracking-wider fw-bold">Password</label>
                        <input
                            type="password"
                            className="form-control form-control-lg border-0 bg-secondary bg-opacity-10 text-center"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ borderRadius: '10px' }}
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-success btn-lg w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                        disabled={loading}
                        style={{ borderRadius: '10px', backgroundColor: '#00c853', borderColor: '#00c853' }}
                    >
                        {loading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                            <>
                                <i className="bi bi-lock-fill"></i>
                                Login
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LandingPage;
