import React, { useEffect, useState } from "react";
import { fetchInventory, updateInventoryItem, deleteInventoryItem } from "../services/api";
import EditItemForm from "./EditItemForm";
import "../../src/styles.css"; // Add your CSS file here for styling

function InventoryList() {
    const [inventory, setInventory] = useState([]);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null); // For handling item editing

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
        setEditingItem(item); // Set the item being edited
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (!confirmDelete) return;

        try {
            await deleteInventoryItem(id); // Assume deleteInventoryItem is defined in api.js
            setInventory((prev) => prev.filter((item) => item._id !== id));
            setSuccessMessage("Item deleted successfully.");
        } catch (err) {
            setError("Failed to delete item.");
        } finally {
            setTimeout(() => setSuccessMessage(""), 3000); // Clear success message after 3 seconds
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    // If editing an item, render the EditItemForm
    if (editingItem) {
        return (
            <EditItemForm
                item={editingItem}
                onCancel={() => setEditingItem(null)} // Cancel editing
                onSave={(updatedItem) => {
                    // Update the inventory list with the edited item
                    setInventory((prev) =>
                        prev.map((item) => (item._id === updatedItem._id ? updatedItem : item))
                    );
                    setEditingItem(null); // Exit editing mode
                    setSuccessMessage("Item updated successfully.");
                }}
            />
        );
    }

    if (inventory.length === 0) {
        return <div>No items found</div>;
    }

    return (
        <div>
            {successMessage && <div className="success">{successMessage}</div>}
            {error && <div className="error">{error}</div>}
            <ul>
                {inventory.map((item) => (
                    <li key={item._id}>
                        {item.name} - Quantity: {item.quantity}
                        <button onClick={() => handleEdit(item)}>Edit</button>
                        <button onClick={() => handleDelete(item._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default InventoryList;