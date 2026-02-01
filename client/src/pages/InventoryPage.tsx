import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Loader from '../components/Loader';

interface Product {
    id: string;
    display_name: string;
    current_inventory_count: number;
}

const InventoryPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
            }
            setLoading(false);
        };

        fetchInventory();
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="w-100 mt-4 px-2">
            <div className="card shadow-sm border-0" style={{ borderRadius: '15px' }}>
                <div className="card-body p-0">
                    <div className="p-3 border-bottom bg-white" style={{ borderRadius: '15px 15px 0 0' }}>
                        <h4 className="mb-0 text-info d-flex align-items-center">
                            <i className="bi bi-box-seam-fill me-2"></i>
                            Current Inventory
                        </h4>
                    </div>
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="ps-3 py-3 border-0">Cookie Name</th>
                                    <th className="text-center py-3 border-0 pe-3">In Stock</th>
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
                                            <td className="ps-3 py-3 align-middle">{product.display_name}</td>
                                            <td className="text-center py-3 align-middle pe-3">
                                                <span className={`badge rounded-pill ${product.current_inventory_count > 0 ? 'bg-success' : 'bg-danger'} px-3 py-2`} style={{ minWidth: '45px' }}>
                                                    {product.current_inventory_count}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryPage;
