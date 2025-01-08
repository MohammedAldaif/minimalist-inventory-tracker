import React, { useEffect, useState } from "react";
import { fetchInventory } from "../services/api";

function InventoryList() {
    const [inventory, setInventory] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(false);
                console.log("Fetching inventory data...");
                const data = await fetchInventory();
                console.log("Fetched inventory data:", data);
                setInventory(data);
            } catch (err) {
                setLoading(false);
                console.error("Error fetching inventory:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

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
            {inventory.map(item => (
                <li key={item._id}>
                    {item.name} - Quantity: {item.quantity}
                </li>
            ))}
        </ul>
    );
}

export default InventoryList;
