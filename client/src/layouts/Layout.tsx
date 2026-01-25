import React, { type ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, signOut } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const isDashboard = location.pathname === '/dashboard';
    const isAuthPage = location.pathname === '/';

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <header className="bg-white border-bottom py-3 px-4 d-flex justify-content-center align-items-center sticky-top shadow-sm">
                <h1 className="h2 mb-0 text-primary" style={{ fontFamily: 'serif', fontWeight: 'bold' }}>
                    Cookie Counter v4
                </h1>
            </header>

            <main className="flex-grow-1 container d-flex align-items-center justify-content-center py-4">
                <div className="w-100" style={{ maxWidth: '500px' }}>
                    {children}
                </div>
            </main>

            {!isAuthPage && (
                <footer className="footer mt-auto py-4 bg-white border-top shadow-sm">
                    <div className="container text-center px-4">
                        {user && (
                            isDashboard ? (
                                <button
                                    onClick={signOut}
                                    className="btn btn-secondary btn-lg w-100 py-3 mb-3 d-flex align-items-center justify-content-center gap-2"
                                    style={{ borderRadius: '15px', backgroundColor: '#a0a0a0', borderColor: '#a0a0a0' }}
                                >
                                    <i className="bi bi-lock-fill"></i>
                                    Logout
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="btn btn-primary btn-lg w-100 py-3 mb-3 d-flex align-items-center justify-content-center gap-2"
                                    style={{ borderRadius: '15px' }}
                                >
                                    <i className="bi bi-arrow-left-circle-fill"></i>
                                    Back
                                </button>
                            )
                        )}
                        <p className="mb-0 text-muted small">&copy; 2026 Cookie Counter v4. All rights reserved.</p>
                    </div>
                </footer>
            )}
        </div>
    );
};

export default Layout;
