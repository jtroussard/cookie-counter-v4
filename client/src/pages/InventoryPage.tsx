import React from 'react';

const InventoryPage: React.FC = () => {
    return (
        <div className="card shadow-sm border-0 p-4 text-center mt-5" style={{ borderRadius: '20px' }}>
            <i className="bi bi-box-seam-fill text-info display-1 mb-4"></i>
            <h2 className="mb-3 text-info">Inventory Home Page</h2>
            <p className="text-muted">Welcome to the Inventory management area.</p>
        </div>
    );
};

export default InventoryPage;
