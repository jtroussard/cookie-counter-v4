import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';

interface Product {
    id: string;
    display_name: string;
    current_inventory_count: number;
}

const InventoryPage: React.FC = () => {
    const { profile } = useAuth();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editedInventory, setEditedInventory] = useState<{ [key: string]: number }>({});
    const [showHelp, setShowHelp] = useState(false);

    const isAdmin = profile?.role === 'ADMIN';

    const fetchInventory = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('id, display_name, current_inventory_count')
            .order('display_name', { ascending: true });

        if (error) {
            console.error('Error fetching inventory:', error);
        } else {
            setProducts(data || []);
            // Initialize edited inventory with 0s (representing no task staged)
            const initialMap: { [key: string]: number } = {};
            data?.forEach(p => {
                initialMap[p.id] = 0;
            });
            setEditedInventory(initialMap);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleInputChange = (productId: string, value: string) => {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue) && numValue >= 0) {
            setEditedInventory(prev => ({
                ...prev,
                [productId]: numValue
            }));
        } else if (value === '') {
            setEditedInventory(prev => ({
                ...prev,
                [productId]: 0
            }));
        }
    };

    const handleSave = async () => {
        // Only rows where the admin entered a number > 0
        const changes = products.filter(p => editedInventory[p.id] > 0);

        if (changes.length === 0) return;

        setIsSaving(true);

        const journalEntries = changes.map(p => {
            // Option A Logic: Target Total - Current Total = Difference
            const difference = editedInventory[p.id] - p.current_inventory_count;
            return {
                product_id: p.id,
                difference: difference,
                cause: 'adjustment',
                user_id: profile?.id
            };
        });

        const { error } = await supabase
            .from('journal')
            .insert(journalEntries);

        if (error) {
            alert('Error saving changes: ' + error.message);
        } else {
            await fetchInventory(); // Refresh counts and reset inputs to 0
            alert('Inventory updated successfully!');
        }

        setIsSaving(false);
    };

    const handleClear = () => {
        const initialMap: { [key: string]: number } = {};
        products.forEach(p => {
            initialMap[p.id] = 0;
        });
        setEditedInventory(initialMap);
    };

    const hasChanges = products.some(p => editedInventory[p.id] > 0);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="w-100 mt-4 px-2 pb-5">
            <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
                <div className="card-body p-0">
                    <div className="p-3 border-bottom bg-white d-flex justify-content-between align-items-center" style={{ borderRadius: '15px 15px 0 0' }}>
                        <h4 className="mb-0 text-info d-flex align-items-center">
                            <i className="bi bi-box-seam-fill me-2"></i>
                            Current Inventory
                        </h4>
                        {isAdmin && (
                            <button
                                className="btn btn-link text-muted p-0"
                                onClick={() => setShowHelp(true)}
                                title="Page Help"
                            >
                                <i className="bi bi-question-circle-fill fs-4"></i>
                            </button>
                        )}
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-3 py-3 border-0">Cookie Name</th>
                                    <th className="text-center py-3 border-0 pe-3">{isAdmin ? 'New Total' : 'In Stock'}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan={2} className="text-center py-5 text-muted">
                                            No products found.
                                        </td>
                                    </tr>
                                ) : (
                                    products.map((product) => (
                                        <tr key={product.id}>
                                            <td className="ps-3 py-3 align-middle">
                                                <div className="d-flex align-items-center flex-wrap">
                                                    <span className="me-2">{product.display_name}</span>
                                                    {isAdmin && (
                                                        <span className={`badge rounded-pill ${product.current_inventory_count > 0 ? 'bg-success' : 'bg-danger'} px-2 py-1 small-badge`} style={{ fontSize: '0.75rem' }}>
                                                            {product.current_inventory_count}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="text-center py-3 align-middle pe-3" style={{ width: isAdmin ? '120px' : 'auto' }}>
                                                {isAdmin ? (
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm text-center"
                                                        placeholder="0"
                                                        value={editedInventory[product.id] === 0 ? '' : editedInventory[product.id]}
                                                        onChange={(e) => handleInputChange(product.id, e.target.value)}
                                                        min="0"
                                                        style={{ borderRadius: '8px' }}
                                                    />
                                                ) : (
                                                    <span className={`badge rounded-pill ${product.current_inventory_count > 0 ? 'bg-success' : 'bg-danger'} px-3 py-2`} style={{ minWidth: '45px' }}>
                                                        {product.current_inventory_count}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isAdmin && (
                <div className="mt-4 d-flex justify-content-center gap-3">
                    {/* Save Button */}
                    <span
                        className="custom-tooltip-wrapper"
                        data-tooltip={!hasChanges ? "Update inventory values to enable this button" : ""}
                    >
                        <button
                            className="btn btn-primary btn-muted-disabled px-4 py-2 shadow-sm d-flex align-items-center"
                            style={{ borderRadius: '10px' }}
                            onClick={handleSave}
                            disabled={isSaving || !hasChanges}
                        >
                            {isSaving ? (
                                <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
                            ) : (
                                <><i className="bi bi-check-lg me-2"></i>Save Changes</>
                            )}
                        </button>
                    </span>

                    {/* Clear Button */}
                    <span
                        className="custom-tooltip-wrapper"
                        data-tooltip={!hasChanges ? "Update inventory values to enable this button" : ""}
                    >
                        <button
                            className="btn btn-warning btn-muted-disabled px-4 py-2 shadow-sm d-flex align-items-center"
                            style={{ borderRadius: '10px' }}
                            onClick={handleClear}
                            disabled={isSaving || !hasChanges}
                        >
                            <i className="bi bi-x-circle me-2"></i>
                            Clear
                        </button>
                    </span>
                </div>
            )}

            {/* Help Modal */}
            {showHelp && (
                <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0" style={{ borderRadius: '20px' }}>
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title text-info">Inventory Help</h5>
                                <button type="button" className="btn-close" onClick={() => setShowHelp(false)}></button>
                            </div>
                            <div className="modal-body pt-2">
                                <p><strong>No math required for you!</strong></p>
                                <p>Simply enter the <strong>absolute number</strong> of boxes you have physically verified on the shelf.</p>
                                <p>The system will automatically calculate whether it needs to add or subtract stock based on what's currently in the system.</p>
                                <div className="alert alert-info py-2 mb-0">
                                    <i className="bi bi-info-circle-fill me-2"></i>
                                    Example: If the system says 10, but you see 12, just type "12" and save.
                                </div>
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

export default InventoryPage;
