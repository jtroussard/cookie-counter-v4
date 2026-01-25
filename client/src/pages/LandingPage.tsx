import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useAuth } from '../context/AuthContext';

const LandingPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { globalLoading, setGlobalLoading } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setGlobalLoading(true);
        setError(null);

        const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (loginError) {
            setError(loginError.message);
            setGlobalLoading(false);
        } else {
            // We don't set loading to false here because we expect a redirect 
            // which will trigger another loading state in ProtectedRoute/Layout
            navigate('/dashboard');
        }
    };

    return (
        <div className="container-fluid d-flex align-items-center justify-content-center">
            <div className="card shadow-sm p-4 w-100 border-0" style={{ borderRadius: '20px' }}>

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
                        disabled={globalLoading}
                        style={{ borderRadius: '10px', backgroundColor: '#00c853', borderColor: '#00c853' }}
                    >
                        {globalLoading ? (
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
