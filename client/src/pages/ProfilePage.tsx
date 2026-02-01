import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProfilePage: React.FC = () => {
    const { profile } = useAuth();

    return (
        <div className="w-100 mt-4 px-2 pb-5">
            <div className="card shadow-sm border-0 p-4" style={{ borderRadius: '20px' }}>
                <div className="text-center mb-4">
                    <div className="bg-light d-inline-block p-4 rounded-circle mb-3 shadow-inner">
                        <i className="bi bi-person-fill text-info" style={{ fontSize: '4rem' }}></i>
                    </div>
                    <h2 className="mb-1 text-info">{profile?.first_name} {profile?.last_name}</h2>
                    <span className="badge rounded-pill bg-info px-3 py-2">{profile?.role}</span>
                </div>

                <div className="mt-2 text-start">
                    <div className="mb-4">
                        <label className="text-muted small text-uppercase fw-bold mb-1 d-block">Full Name</label>
                        <div className="bg-light p-3 rounded-3 border">
                            <i className="bi bi-person me-2 text-info"></i>
                            {profile?.first_name} {profile?.last_name}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="text-muted small text-uppercase fw-bold mb-1 d-block">Email Address</label>
                        <div className="bg-light p-3 rounded-3 border">
                            <i className="bi bi-envelope me-2 text-info"></i>
                            {profile?.email}
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="text-muted small text-uppercase fw-bold mb-1 d-block">Account Role</label>
                        <div className="bg-light p-3 rounded-3 border">
                            <i className="bi bi-shield-check me-2 text-info"></i>
                            {profile?.role === 'ADMIN' ? 'Administrator' : 'Application User'}
                        </div>
                    </div>
                </div>
            </div>

            <div className="card shadow-sm border-0 p-3 mt-4 text-center bg-light" style={{ borderRadius: '15px' }}>
                <p className="text-muted small mb-0">
                    <i className="bi bi-info-circle me-2"></i>
                    Profile settings are currently read-only.
                </p>
            </div>
        </div>
    );
};

export default ProfilePage;
