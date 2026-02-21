import React, { type ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, signOut, loading, globalLoading } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const isDashboard = location.pathname === '/dashboard';
    const isAuthPage = location.pathname === '/';

    // Route Mapping Logic
    const getParentPath = (path: string): string | null => {
        // Explicit Parent Mapping
        const parentMap: Record<string, string> = {
            '/profile': '/dashboard',
            '/sales': '/dashboard',
            '/inventory': '/dashboard',
            '/sales/new': '/sales', // Future proofing
            '/sales/create': '/sales', // Future proofing
        };

        if (parentMap[path]) return parentMap[path];

        // Dynamic / Fallback Mapping
        if (path.startsWith('/sales/')) return '/sales'; // Any detail sales page goes back to Sales list
        if (path.startsWith('/inventory/')) return '/inventory';

        return null;
    };

    const backPath = getParentPath(location.pathname);

    if (loading || globalLoading) {
        return <Loader />;
    }

    return (
        <div className="d-flex flex-column min-vh-100 bg-light align-items-center">
            <header className="bg-white border-bottom py-3 shadow-sm w-100">
                <div className="container text-center">
                    <h1 className="h2 mb-0 text-primary" style={{ fontFamily: 'serif', fontWeight: 'bold' }}>
                        Cookie Counter v4
                    </h1>
                </div>
            </header>

            {/* Main content with padding to accommodate sticky footer */}
            <main
                className="flex-grow-1 pt-4 w-100 d-flex flex-column align-items-center justify-content-center"
                style={{ paddingBottom: !isAuthPage ? '140px' : '20px' }}
            >
                <div className="main-content-container">
                    {children}
                </div>
            </main>

            {!isAuthPage && (
                <footer className="footer fixed-bottom py-3 bg-white border-top shadow-lg w-100" style={{ zIndex: 1030 }}>
                    <div className="main-content-container text-center">
                        {user && (
                            isDashboard ? (
                                <button
                                    onClick={signOut}
                                    className="btn btn-secondary btn-lg w-100 py-3 mb-2 d-flex align-items-center justify-content-center gap-2"
                                    style={{ borderRadius: '15px', backgroundColor: '#a0a0a0', borderColor: '#a0a0a0' }}
                                >
                                    <i className="bi bi-lock-fill"></i>
                                    Logout
                                </button>
                            ) : backPath ? (
                                <button
                                    onClick={() => navigate(backPath)}
                                    className="btn btn-primary btn-lg w-100 py-3 mb-2 d-flex align-items-center justify-content-center gap-2"
                                    style={{ borderRadius: '15px' }}
                                >
                                    <i className="bi bi-arrow-left-circle-fill"></i>
                                    Back
                                </button>
                            ) : null
                        )}
                        <p className="mb-0 text-muted small" style={{ fontSize: '0.75rem' }}>&copy; 2026 Cookie Counter v4. All rights reserved.</p>
                    </div>
                </footer>
            )}
        </div>
    );
};

export default Layout;
