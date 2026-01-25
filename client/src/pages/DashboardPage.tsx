import React from 'react';
import NavButton from '../components/NavButton';

const DashboardPage: React.FC = () => {
    return (
        <div className="w-100 px-2">
            <NavButton
                label="Sales"
                icon="bi-cart-fill"
                to="/sales"
                colorClass="btn-info"
            // Note: Using btn-info for light blue as per screenshot
            />

            <NavButton
                label="Inventory"
                icon="bi-box-seam-fill"
                to="/inventory"
                colorClass="btn-info"
            />

            <NavButton
                label="Profile"
                icon="bi-person-fill"
                to="/profile"
                colorClass="btn-info"
            />
        </div>
    );
};

export default DashboardPage;
