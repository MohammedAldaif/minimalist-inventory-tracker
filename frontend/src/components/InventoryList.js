import React, { useEffect, useState } from "react";
import { fetchInventory, updateInventoryItem, deleteInventoryItem } from "../services/api";
import EditItemForm from "./EditItemForm";

function InventoryList() {
    const [inventory, setInventory] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null); // For handling item editing

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const data = await fetchInventory();
                setInventory(data);
            } catch (err) {
                setError(err.message);
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
        try {
            await deleteInventoryItem(id); // Assume deleteInventoryItem is defined in api.js
            setInventory((prev) => prev.filter((item) => item._id !== id));
        } catch (err) {
            console.error("Error deleting item:", err.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
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
                }}
            />
        );
    }

    if (inventory.length === 0) {
        return <div>No items found</div>;
    }

    return (
        <ul>
            {inventory.map((item) => (
                <li key={item._id}>
                    {item.name} - Quantity: {item.quantity}
                    <button onClick={() => handleEdit(item)}>Edit</button>
                    <button onClick={() => handleDelete(item._id)}>Delete</button>
                </li>
            ))}
        </ul>
    );
}

export default InventoryList;