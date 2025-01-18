import React, { useEffect, useState } from "react";
import InventoryCharts from "../components/InventoryCharts";
import { getAuth } from "firebase/auth";

function DashboardPage() {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const auth = getAuth();

    useEffect(() => {
        async function fetchInventory() {
            try {
                const user = auth.currentUser;
                if (!user) throw new Error("User not authenticated");

                const token = await user.getIdToken(); 
                
                const response = await fetch("http://localhost:5000/api/inventory", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Failed to fetch inventory data");

                const data = await response.json();
                setInventory(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchInventory();
    }, [auth]);

    // 📌 Calculate Total Stock
    const totalStock = inventory.reduce((sum, item) => sum + item.quantity, 0);

    // 📌 Find Low Stock Items (Threshold: 5)
    const lowStockItems = inventory.filter(item => item.quantity <= 5);

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-center">📊 Inventory Dashboard</h2>

            {loading && <p className="text-center">Loading inventory data...</p>}
            {error && <p className="alert alert-danger">{error}</p>}
            
            {!loading && !error && (
                <>
                    {/* ✅ Grid Layout */}
                    <div className="row">
                        {/* 📦 Total Stock */}
                        <div className="col-md-4">
                            <div className="card shadow-sm text-white bg-primary p-3">
                                <h5 className="card-title">📦 Total Stock</h5>
                                <h3 className="fw-bold">{totalStock}</h3>
                            </div>
                        </div>

                        {/* ⚠ Low Stock Alerts */}
                        <div className="col-md-4">
                            <div className="card shadow-sm text-white bg-danger p-3">
                                <h5 className="card-title">⚠ Low Stock Items</h5>
                                <h3 className="fw-bold">{lowStockItems.length}</h3>
                            </div>
                        </div>

                        {/* 📊 Inventory Categories */}
                        <div className="col-md-4">
                            <div className="card shadow-sm text-white bg-success p-3">
                                <h5 className="card-title">📊 Unique Categories</h5>
                                <h3 className="fw-bold">{new Set(inventory.map(item => item.category)).size}</h3>
                            </div>
                        </div>
                    </div>

                    {/* 🛠️ Charts Section */}
                    <div className="row mt-4">
                        {/* 📊 Stock by Category */}
                        <div className="col-md-6">
                            <div className="card shadow-sm p-3">
                                <h5 className="card-title">Stock by Category</h5>
                                <InventoryCharts inventory={inventory} chartType="bar" />
                            </div>
                        </div>

                        {/* 🏆 Top 5 Stocked Items */}
                        <div className="col-md-6">
                            <div className="card shadow-sm p-3">
                                <h5 className="card-title">Top 5 Stocked Items</h5>
                                <InventoryCharts inventory={inventory} chartType="pie" />
                            </div>
                        </div>
                    </div>

                    {/* 📈 Stock Trends Over Time */}
                    <div className="row mt-4">
                        <div className="col-md-12">
                            <div className="card shadow-sm p-3">
                                <h5 className="card-title">Stock Trends Over Time</h5>
                                <InventoryCharts inventory={inventory} chartType="line" />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default DashboardPage;