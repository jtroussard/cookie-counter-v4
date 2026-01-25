import React, { type ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
    children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, signOut } = useAuth();

    return (
        <div className="d-flex flex-column min-vh-100">
            <header className="bg-white border-bottom py-3 px-4 d-flex justify-content-between align-items-center sticky-top">
                <h1 className="h4 mb-0 text-primary" style={{ fontFamily: 'serif', fontWeight: 'bold' }}>
                    Cookie Counter v4
                </h1>
                {user && (
                    <button onClick={signOut} className="btn btn-outline-danger btn-sm rounded-pill">
                        <i className="bi bi-box-arrow-right me-1"></i>
                        Logout
                    </button>
                )}
            </header>

            <main className="flex-grow-1 p-3">
                {children}
            </main>

            <footer className="bg-light border-top py-3 text-center text-muted small">
                <p className="mb-0">&copy; 2026 Cookie Counter v4. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;
