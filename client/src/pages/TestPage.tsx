import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const TestPage: React.FC = () => {
    const { user, session } = useAuth();
    const [backendMessage, setBackendMessage] = useState<string>('Calling backend...');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProtectedData = async () => {
            if (!session?.access_token) return;

            try {
                const response = await fetch('http://localhost:3001/api/protected-test', {
                    headers: {
                        'Authorization': `Bearer ${session.access_token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setBackendMessage(data.message);
            } catch (err: any) {
                setError(err.message);
            }
        };

        fetchProtectedData();
    }, [session]);

    return (
        <div className="card shadow-sm border-0 p-4 text-center mt-5" style={{ borderRadius: '20px' }}>
            <i className="bi bi-check-circle-fill text-success display-1 mb-4"></i>
            <h2 className="mb-3">You are logged in!</h2>
            <p className="text-muted mb-4">Welcome back, <strong>{user?.email}</strong></p>

            <div className="alert alert-info py-3 border-0 bg-light">
                <h6 className="text-uppercase small fw-bold mb-2">Backend Verification:</h6>
                {error ? (
                    <span className="text-danger">Error: {error}</span>
                ) : (
                    <span className="text-primary">{backendMessage}</span>
                )}
            </div>
        </div>
    );
};

export default TestPage;
