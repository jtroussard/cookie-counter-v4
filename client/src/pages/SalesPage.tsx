import React, { useState } from 'react';
import NavButton from '../components/NavButton';

const SalesPage: React.FC = () => {
    const [showHelp, setShowHelp] = useState(false);

    return (
        <div className="w-100 mt-5">
            <div className="d-flex justify-content-center align-items-center mb-4 position-relative">
                <h2 className="text-center text-primary fw-bold mb-0">Sales Dashboard</h2>
                <button
                    className="btn btn-link text-muted p-0 position-absolute"
                    style={{ right: '0', top: '50%', transform: 'translateY(-50%)' }}
                    onClick={() => setShowHelp(true)}
                    title="Page Help"
                >
                    <i className="bi bi-question-circle-fill fs-4"></i>
                </button>
            </div>

            <NavButton
                label="Sales History"
                icon="bi-clock-history"
                to="/sales/history"
                colorClass="btn-success"
            />

            <NavButton
                label="New Sale"
                icon="bi-plus-circle-fill"
                to="/sales/new"
                colorClass="btn-success"
            />

            {/* Help Modal */}
            {showHelp && (
                <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0" style={{ borderRadius: '20px' }}>
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title text-info">Sales Help</h5>
                                <button type="button" className="btn-close" onClick={() => setShowHelp(false)}></button>
                            </div>
                            <div className="modal-body pt-2">
                                <p><strong>Manage your cookie sales here.</strong></p>
                                <ul className="list-unstyled">
                                    <li className="mb-2">
                                        <i className="bi bi-clock-history text-success me-2"></i>
                                        <strong>Sales History:</strong> View past transactions and invoices.
                                    </li>
                                    <li className="mb-2">
                                        <i className="bi bi-plus-circle-fill text-success me-2"></i>
                                        <strong>New Sale:</strong> Start a new order for a customer.
                                    </li>
                                </ul>
                            </div>
                            <div className="modal-footer border-0">
                                <button type="button" className="btn btn-info text-white px-4" onClick={() => setShowHelp(false)} style={{ borderRadius: '10px' }}>Got it!</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesPage;
