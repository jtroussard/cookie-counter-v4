import React from 'react';

const SalesPage: React.FC = () => {
    return (
        <div className="card shadow-sm border-0 p-4 text-center mt-5" style={{ borderRadius: '20px' }}>
            <i className="bi bi-cart-fill text-info display-1 mb-4"></i>
            <h2 className="mb-3 text-info">Sales Home Page</h2>
            <p className="text-muted">Welcome to the Sales management area.</p>
        </div>
    );
};

export default SalesPage;
