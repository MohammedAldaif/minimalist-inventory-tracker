import React, { useState, useEffect } from "react";
import { getInventory } from "../services/api";

function InventoryList() {
    const [inventory, setInventory] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        // Fetch inventory data on component load
        const fetchInventory = async () => {
            try {
                const data = await getInventory();
                setInventory(data);
            } catch (err) {
                setError("Failed to fetch inventory data");
            }
        };

        fetchInventory();
    }, []);

    return (
        <div>
            <h2>Inventory List</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <ul>
                {inventory.map((item) => (
                    <li key={item._id}>
                        <strong>{item.name}</strong> - {item.quantity}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default InventoryList;
