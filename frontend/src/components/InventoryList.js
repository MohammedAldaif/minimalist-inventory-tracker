import React, { useEffect, useState } from "react";
import { fetchInventory, deleteInventoryItem } from "../services/api";

function InventoryList() {
    const [inventory, setInventory] = useState([]);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [editingItemId, setEditingItemId] = useState(null);
    const [newItem, setNewItem] = useState({ name: "", quantity: "" });
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const data = await fetchInventory();
                setInventory(data);
            } catch (err) {
                setError("Failed to fetch inventory.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;
        try {
            await deleteInventoryItem(id);
            setInventory((prev) => prev.filter((item) => item._id !== id));
            setSuccessMessage("Item deleted successfully.");
        } catch (err) {
            setError("Failed to delete item.");
        } finally {
            setTimeout(() => setSuccessMessage(""), 3000);
        }
    };

    const handleEdit = (id) => {
        setEditingItemId(id);
    };

    const handleSaveEdit = (id, updatedFields) => {
        setInventory((prev) =>
            prev.map((item) => (item._id === id ? { ...item, ...updatedFields } : item))
        );
        setEditingItemId(null);
        setSuccessMessage("Item updated successfully.");
    };

    const handleAddItem = () => {
        if (!newItem.name || !newItem.quantity) {
            setError("Name and Quantity are required.");
            return;
        }
        setInventory((prev) => [...prev, { ...newItem, _id: Date.now().toString() }]);
        setNewItem({ name: "", quantity: "" });
        setError("");
        setSuccessMessage("Item added successfully.");
    };

    const filteredInventory = inventory.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-danger">{error}</div>;

    return (
        <div className="container mt-3">
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <div className="input-group my-3">
                <span className="input-group-text">🔍</span>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search inventory..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Quantity</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredInventory.map((item) =>
                        editingItemId === item._id ? (
                            <tr key={item._id}>
                                <td>
                                    <input
                                        type="text"
                                        defaultValue={item.name}
                                        onBlur={(e) =>
                                            handleSaveEdit(item._id, { name: e.target.value })
                                        }
                                        className="form-control"
                                    />
                                </td>
                                <td>
                                    <input
                                        type="number"
                                        defaultValue={item.quantity}
                                        onBlur={(e) =>
                                            handleSaveEdit(item._id, { quantity: e.target.value })
                                        }
                                        className="form-control"
                                    />
                                </td>
                                <td>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => setEditingItemId(null)}
                                    >
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        ) : (
                            <tr key={item._id}>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn-primary mx-1"
                                        onClick={() => handleEdit(item._id)}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="btn btn-sm btn-danger mx-1"
                                        onClick={() => handleDelete(item._id)}
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        )
                    )}
                    <tr>
                        <td>
                            <input
                                type="text"
                                placeholder="New Item Name"
                                value={newItem.name}
                                onChange={(e) =>
                                    setNewItem((prev) => ({ ...prev, name: e.target.value }))
                                }
                                className="form-control"
                            />
                        </td>
                        <td>
                            <input
                                type="number"
                                placeholder="New Quantity"
                                value={newItem.quantity}
                                onChange={(e) =>
                                    setNewItem((prev) => ({ ...prev, quantity: e.target.value }))
                                }
                                className="form-control"
                            />
                        </td>
                        <td>
                            <button className="btn btn-success btn-sm" onClick={handleAddItem}>
                                ➕
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default InventoryList;