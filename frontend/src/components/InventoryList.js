import React, { useEffect, useState } from "react";
import { fetchInventory, updateInventoryItem, deleteInventoryItem } from "../services/api";
import EditItemForm from "./EditItemForm";

function InventoryList() {
    const [inventory, setInventory] = useState([]);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);

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

    const handleEdit = (item) => {
        setEditingItem(item);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (!confirmDelete) return;

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

    if (loading) {
        return <div className="text-center text-secondary">Loading...</div>;
    }

    if (error) {
        return <div className="alert alert-danger text-center">{error}</div>;
    }

    if (editingItem) {
        return (
            <EditItemForm
                item={editingItem}
                onCancel={() => setEditingItem(null)}
                onSave={(updatedItem) => {
                    setInventory((prev) =>
                        prev.map((item) => (item._id === updatedItem._id ? updatedItem : item))
                    );
                    setEditingItem(null);
                    setSuccessMessage("Item updated successfully.");
                }}
            />
        );
    }

    if (inventory.length === 0) {
        return <div className="text-center text-secondary">No items found</div>;
    }

    return (
        <div className="container mt-4">
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <ul className="list-group">
                {inventory.map((item) => (
                    <li
                        key={item._id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                    >
                        <span>
                            {item.name} - <span className="fw-bold">Quantity: {item.quantity}</span>
                        </span>
                        <div>
                            <button
                                onClick={() => handleEdit(item)}
                                className="btn btn-primary btn-sm me-2"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(item._id)}
                                className="btn btn-danger btn-sm"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default InventoryList;
