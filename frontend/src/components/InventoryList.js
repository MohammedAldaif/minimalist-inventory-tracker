import React, { useEffect, useState } from "react";
import { fetchInventory, deleteInventoryItem } from "../services/api";

function InventoryList() {
    const [inventory, setInventory] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
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

    const handleDelete = async (id) => {
        try {
            await deleteInventoryItem(id);
            setInventory(inventory.filter((item) => item._id !== id));
        } catch (err) {
            alert("Failed to delete item: " + err.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (inventory.length === 0) {
        return <div>No items found</div>;
    }

    return (
        <ul>
            {inventory.map((item) => (
                <li key={item._id}>
                    {item.name} - Quantity: {item.quantity}
                    <button onClick={() => handleDelete(item._id)}>Delete</button>
                </li>
            ))}
        </ul>
    );
}

export default InventoryList;