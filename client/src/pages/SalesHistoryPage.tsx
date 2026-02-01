import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Loader from '../components/Loader';

interface Invoice {
    id: string;
    date: string;
    customer_name: string;
    customer_address: string;
    customer_email: string;
    total_amount: number;
    created_at: string;
}

interface SaleItem {
    id: string;
    qty: number;
    product: {
        display_name: string;
        price: number;
    };
}

const SalesHistoryPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [invoices, setInvoices] = useState<Invoice[]>([]);

    // Modal State
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
    const [invoiceItems, setInvoiceItems] = useState<SaleItem[]>([]);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // 1. Fetch Invoices on Mount
    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('invoices')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching invoices:', error);
        } else {
            setInvoices(data || []);
        }
        setLoading(false);
    };

    // 2. Fetch Details on Click
    const handleRowClick = async (invoice: Invoice) => {
        setSelectedInvoice(invoice);
        setLoadingDetails(true);
        setInvoiceItems([]); // Clear previous

        // Fetch sales items joined with product details
        const { data, error } = await supabase
            .from('sales')
            .select(`
                id,
                qty,
                product:products (
                    display_name,
                    price
                )
            `)
            .eq('invoice_id', invoice.id);

        if (error) {
            console.error('Error fetching invoice details:', error);
        } else {
            // @ts-ignore - Supabase types join inference can be tricky, casting for safety
            setInvoiceItems(data as any || []);
        }
        setLoadingDetails(false);
    };

    const closeModal = () => {
        setSelectedInvoice(null);
        setInvoiceItems([]);
    };

    // Helper to format date
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return <Loader />;

    return (
        <div className="w-100 mt-4 px-2 pb-5 mb-5">
            <h2 className="text-center text-primary fw-bold mb-4">Sales History</h2>

            {/* Invoices List */}
            <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
                <div className="table-responsive">
                    <table className="table table-hover mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4 py-3 border-0 text-muted small text-uppercase">Date</th>
                                <th className="py-3 border-0 text-muted small text-uppercase">Customer</th>
                                <th className="pe-4 py-3 border-0 text-end text-muted small text-uppercase">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="text-center py-5 text-muted">
                                        No sales found yet.
                                    </td>
                                </tr>
                            ) : (
                                invoices.map(inv => (
                                    <tr
                                        key={inv.id}
                                        onClick={() => handleRowClick(inv)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <td className="ps-4 py-3 text-nowrap">
                                            <div className="fw-bold text-dark">{new Date(inv.date || inv.created_at).toLocaleDateString()}</div>
                                            <small className="text-muted">{new Date(inv.date || inv.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                                        </td>
                                        <td className="py-3">
                                            <div className="fw-bold text-dark text-truncate" style={{ maxWidth: '150px' }}>
                                                {inv.customer_name}
                                            </div>
                                        </td>
                                        <td className="pe-4 py-3 text-end text-primary">
                                            <i className="bi bi-chevron-right"></i>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Receipt Modal */}
            {selectedInvoice && (
                <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                        <div className="modal-content border-0 shadow" style={{ borderRadius: '20px' }}>
                            <div className="modal-header border-bottom-0 pb-0">
                                <h5 className="modal-title fw-bold">Sale Receipt</h5>
                                <button type="button" className="btn-close" onClick={closeModal}></button>
                            </div>
                            <div className="modal-body pt-2">
                                {/* Header Section */}
                                <div className="text-center mb-4">
                                    <div className="display-1 text-primary mb-2">
                                        <i className="bi bi-check-circle-fill"></i>
                                    </div>
                                    <h4 className="fw-bold">{selectedInvoice.customer_name}</h4>
                                    <p className="text-muted small mb-0">{formatDate(selectedInvoice.date || selectedInvoice.created_at)}</p>
                                    <p className="text-muted small text-uppercase">ID: {selectedInvoice.id.slice(0, 8)}</p>
                                </div>

                                {/* Customer Address */}
                                {selectedInvoice.customer_address && (
                                    <div className="alert alert-light border mb-3 small">
                                        <strong>Address:</strong><br />
                                        {selectedInvoice.customer_address}
                                        {selectedInvoice.customer_email && (
                                            <>
                                                <br />
                                                <span className="text-muted">{selectedInvoice.customer_email}</span>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Line Items */}
                                <h6 className="text-muted text-uppercase small fw-bold mb-3 border-bottom pb-2">Items Purchased</h6>
                                {loadingDetails ? (
                                    <div className="d-flex justify-content-center py-4">
                                        <div className="spinner-border text-primary spinner-border-sm" role="status"></div>
                                    </div>
                                ) : (
                                    <ul className="list-group list-group-flush">
                                        {invoiceItems.map(item => {
                                            const lineTotal = item.qty * item.product.price;
                                            return (
                                                <li key={item.id} className="list-group-item px-0 py-2">
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <div>
                                                            <div className="fw-bold text-dark">{item.product?.display_name || 'Unknown Product'}</div>
                                                            <div className="text-muted small">
                                                                {item.qty} x ${item.product.price.toFixed(2)}
                                                            </div>
                                                        </div>
                                                        <div className="fw-bold text-dark">
                                                            ${lineTotal.toFixed(2)}
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                        {invoiceItems.length === 0 && !loadingDetails && (
                                            <div className="text-center text-muted small py-2">No items found for this invoice.</div>
                                        )}
                                    </ul>
                                )}

                                {/* Total */}
                                <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                                    <div className="text-muted small">
                                        Total Items: {invoiceItems.reduce((acc, item) => acc + item.qty, 0)}
                                    </div>
                                    <div className="text-end">
                                        <div className="text-muted small text-uppercase fw-bold">Grand Total</div>
                                        <span className="h3 fw-bold text-primary mb-0">
                                            ${invoiceItems.reduce((acc, item) => acc + (item.qty * item.product.price), 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-top-0">
                                <button type="button" className="btn btn-primary w-100" onClick={closeModal} style={{ borderRadius: '10px' }}>
                                    Close Receipt
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SalesHistoryPage;
