import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Loader from '../components/Loader';
import { useNavigate } from 'react-router-dom';

interface Product {
    id: string;
    display_name: string;
    current_inventory_count: number;
    price: number;
}

const NewSalePage: React.FC = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [email, setEmail] = useState('');

    // Selection State: { [product_id]: quantity }
    const [cart, setCart] = useState<{ [key: string]: number }>({});

    // Modal State
    const [showConfirm, setShowConfirm] = useState(false);

    // 1. Fetch Products on Mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('id, display_name, current_inventory_count, price')
            .order('display_name', { ascending: true });

        if (data) {
            setProducts(data);
            // Initialize cart with 0s
            const initialCart: { [key: string]: number } = {};
            data.forEach(p => initialCart[p.id] = 0);
            setCart(initialCart);
        } else if (error) {
            console.error('Error fetching products:', error);
        }
        setLoading(false);
    };

    // 2. Cart Handlers
    const updateQuantity = (productId: string, delta: number) => {
        setCart(prev => {
            const currentQty = prev[productId] || 0;
            const product = products.find(p => p.id === productId);
            if (!product) return prev;

            const newQty = currentQty + delta;

            // Constrain between 0 and Available Stock
            if (newQty < 0) return prev;
            if (newQty > product.current_inventory_count) return prev;

            return { ...prev, [productId]: newQty };
        });
    };

    const handleClear = () => {
        const resetCart: { [key: string]: number } = {};
        products.forEach(p => resetCart[p.id] = 0);
        setCart(resetCart);
    };

    // 3. Validation & Submission
    const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
    const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
        const product = products.find(p => p.id === id);
        return sum + (qty * (product?.price || 0));
    }, 0);

    const hasName = firstName.trim().length > 0 || lastName.trim().length > 0;
    const isValid = totalItems > 0 && hasName;

    const handleSaveClick = () => {
        if (isValid) setShowConfirm(true);
    };

    const confirmSale = async () => {
        setSubmitting(true);
        setShowConfirm(false);

        const customerName = `${firstName} ${lastName}`.trim();
        const fullAddress = [addressLine1, addressLine2, city, state]
            .map(s => s.trim())
            .filter(s => s.length > 0)
            .join(', ');

        try {
            // A. Insert Invoice Header
            // We insert into 'invoices' first to get the ID
            const { data: invoiceData, error: invoiceError } = await supabase
                .from('invoices')
                .insert([{
                    customer_name: customerName,
                    customer_address: fullAddress,
                    customer_email: email.trim(),
                    total_amount: totalPrice
                }])
                .select()
                .single();

            if (invoiceError) throw invoiceError;

            // B. Insert Sales Lines (Items)
            // We map the cart items to the 'sales' table, linking to the invoice_id
            const saleItems = Object.entries(cart)
                .filter(([_, qty]) => qty > 0)
                .map(([productId, qty]) => ({
                    invoice_id: invoiceData.id,
                    product_id: productId,
                    qty: qty
                }));

            const { error: salesError } = await supabase
                .from('sales')
                .insert(saleItems);

            if (salesError) throw salesError;

            // C. Journal & Inventory
            // AUTOMATIC: The DB triggers 'on_sale_insert' and 'on_journal_entry' handle the rest!

            alert('Sale recorded successfully!');
            navigate('/dashboard');

        } catch (error: any) {
            console.error('Sale Failed:', error);
            alert('Error recording sale: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="w-100 mt-4 px-2 pb-5 mb-5">
            <h2 className="text-center text-primary fw-bold mb-4">New Sale</h2>

            {/* Customer Form */}
            <div className="card shadow-sm border-0 p-4 mb-4" style={{ borderRadius: '20px' }}>
                <h5 className="text-muted text-uppercase small fw-bold mb-3">Customer Details</h5>
                <div className="row g-2 mb-2">
                    <div className="col-6">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="First Name"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="col-6">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Last Name"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                        />
                    </div>
                </div>
                <div className="mb-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Address Line 1"
                        value={addressLine1}
                        onChange={e => setAddressLine1(e.target.value)}
                    />
                </div>
                <div className="mb-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Address Line 2 (Optional)"
                        value={addressLine2}
                        onChange={e => setAddressLine2(e.target.value)}
                    />
                </div>
                <div className="row g-2 mb-2">
                    <div className="col-8">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="City"
                            value={city}
                            onChange={e => setCity(e.target.value)}
                        />
                    </div>
                    <div className="col-4">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="State"
                            value={state}
                            onChange={e => setState(e.target.value)}
                        />
                    </div>
                </div>
                <div>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email Address"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                </div>
            </div>

            {/* Product List */}
            <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
                <div className="card-header bg-white border-0 pt-3 pb-2" style={{ borderRadius: '15px 15px 0 0' }}>
                    <h5 className="text-muted text-uppercase small fw-bold mb-0">Select Cookies</h5>
                </div>
                <div className="table-responsive">
                    <table className="table mb-0 align-middle">
                        <tbody>
                            {/* Cookies Section */}
                            {products.filter(p => p.display_name !== 'Donation').map(product => {
                                const isOutOfStock = product.current_inventory_count <= 0;
                                const currentQty = cart[product.id] || 0;

                                return (
                                    <tr key={product.id} className={isOutOfStock ? 'opacity-50' : ''}>
                                        <td className="ps-4 py-3 border-light">
                                            <div className="fw-bold text-dark">{product.display_name}</div>
                                            <div className="d-flex align-items-center gap-2">
                                                <small className={`badge rounded-pill ${isOutOfStock ? 'bg-secondary' : 'bg-info'} text-white`}>
                                                    {isOutOfStock ? 'Out of Stock' : `${product.current_inventory_count} available`}
                                                </small>
                                                <small className="text-muted">${product.price.toFixed(2)}</small>
                                            </div>
                                        </td>
                                        <td className="pe-3 text-end border-light" style={{ minWidth: '140px' }}>
                                            <div className="d-flex align-items-center justify-content-end gap-2">
                                                <button
                                                    className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
                                                    style={{ width: '32px', height: '32px' }}
                                                    disabled={isOutOfStock || currentQty <= 0}
                                                    onClick={() => updateQuantity(product.id, -1)}
                                                >
                                                    <i className="bi bi-dash"></i>
                                                </button>

                                                <span className="fw-bold fs-5" style={{ width: '30px', textAlign: 'center' }}>
                                                    {currentQty}
                                                </span>

                                                <button
                                                    className="btn btn-outline-primary btn-sm rounded-circle d-flex align-items-center justify-content-center"
                                                    style={{ width: '32px', height: '32px' }}
                                                    disabled={isOutOfStock || currentQty >= product.current_inventory_count}
                                                    onClick={() => updateQuantity(product.id, 1)}
                                                >
                                                    <i className="bi bi-plus"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            {/* Other Options Header */}
                            {products.some(p => p.display_name === 'Donation') && (
                                <tr className="bg-light">
                                    <td colSpan={2} className="px-4 py-2 border-light">
                                        <small className="text-muted fw-bold text-uppercase">Other Options</small>
                                    </td>
                                </tr>
                            )}

                            {/* Donation Section */}
                            {products.filter(p => p.display_name === 'Donation').map(product => {
                                // For donation, we treat stock as infinite/always available
                                const currentQty = cart[product.id] || 0;

                                return (
                                    <tr key={product.id}>
                                        <td className="ps-4 py-3 border-light">
                                            <div className="fw-bold text-dark">{product.display_name}</div>
                                            <div className="d-flex align-items-center gap-2">
                                                <small className="badge rounded-pill bg-success text-white">
                                                    Always Available
                                                </small>
                                                <small className="text-muted">${product.price.toFixed(2)}</small>
                                            </div>
                                        </td>
                                        <td className="pe-3 text-end border-light" style={{ minWidth: '140px' }}>
                                            <div className="d-flex align-items-center justify-content-end gap-2">
                                                <button
                                                    className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center"
                                                    style={{ width: '32px', height: '32px' }}
                                                    disabled={currentQty <= 0}
                                                    onClick={() => updateQuantity(product.id, -1)}
                                                >
                                                    <i className="bi bi-dash"></i>
                                                </button>

                                                <span className="fw-bold fs-5" style={{ width: '30px', textAlign: 'center' }}>
                                                    {currentQty}
                                                </span>

                                                <button
                                                    className="btn btn-outline-primary btn-sm rounded-circle d-flex align-items-center justify-content-center"
                                                    style={{ width: '32px', height: '32px' }}
                                                    onClick={() => updateQuantity(product.id, 1)}
                                                >
                                                    <i className="bi bi-plus"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Order Summary & Actions */}
            <div className="card shadow mt-4 border-0 bg-light" style={{ borderRadius: '15px' }}>
                <div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <span className="text-muted small text-uppercase fw-bold d-block">Total</span>
                        <div className="d-flex align-items-baseline gap-2">
                            <span className="display-6 fw-bold text-primary">${totalPrice.toFixed(2)}</span>
                            <span className="text-muted small">({totalItems} items)</span>
                        </div>
                    </div>
                    <div className="d-flex gap-2">
                        <button
                            className="btn btn-light text-muted border"
                            onClick={handleClear}
                            disabled={totalItems === 0}
                            style={{ borderRadius: '10px' }}
                        >
                            Clear
                        </button>
                        <button
                            className="btn btn-primary px-4"
                            onClick={handleSaveClick}
                            disabled={!isValid || submitting}
                            style={{ borderRadius: '10px' }}
                        >
                            {submitting ? 'Saving...' : 'Save Sale'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0" style={{ borderRadius: '20px' }}>
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title">Confirm Sale</h5>
                                <button type="button" className="btn-close" onClick={() => setShowConfirm(false)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to record this sale?</p>
                                <div className="alert alert-light border">
                                    <div className="mb-2"><strong>Customer:</strong> {firstName} {lastName}</div>
                                    <div className="fw-bold mb-1">Items:</div>
                                    <ul className="list-unstyled mb-0 ps-2">
                                        {Object.entries(cart)
                                            .filter(([_, qty]) => qty > 0)
                                            .map(([productId, qty]) => {
                                                const product = products.find(p => p.id === productId);
                                                return (
                                                    <li key={productId} className="d-flex justify-content-between text-muted small">
                                                        <span>{product?.display_name}</span>
                                                        <span className="fw-bold text-dark">{qty}</span>
                                                    </li>
                                                );
                                            })}
                                    </ul>
                                    <div className="border-top mt-2 pt-2 d-flex justify-content-between">
                                        <strong>Total</strong>
                                        <strong>{totalItems} boxes (${totalPrice.toFixed(2)})</strong>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-0">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowConfirm(false)} style={{ borderRadius: '10px' }}>Cancel</button>
                                <button type="button" className="btn btn-success px-4" onClick={confirmSale} style={{ borderRadius: '10px' }}>Yes, Save it!</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewSalePage;
