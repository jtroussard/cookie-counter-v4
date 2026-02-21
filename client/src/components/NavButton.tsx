import React from 'react';
import { Link } from 'react-router-dom';

interface NavButtonProps {
    label: string;
    icon: string;
    to: string;
    colorClass: string;
}

const NavButton: React.FC<NavButtonProps> = ({ label, icon, to, colorClass }) => {
    return (
        <Link
            to={to}
            className={`btn btn-lg w-100 py-4 mb-4 d-flex align-items-center justify-content-center gap-3 shadow-sm border-0 ${colorClass}`}
            style={{ borderRadius: '20px', fontSize: '1.5rem', fontWeight: 'bold', color: 'white' }}
        >
            <i className={`bi ${icon}`}></i>
            {label}
        </Link>
    );
};

export default NavButton;
