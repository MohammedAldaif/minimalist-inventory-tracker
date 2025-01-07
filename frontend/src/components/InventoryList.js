import React, { useEffect, useState } from "react";

function InventoryList() {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/api/inventory")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch inventory");
                }
                return response.json();
            })
            .then((data) => {
                setInventory(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Inventory List</h2>
            <ul>
                {inventory.map((item) => (
                    <li key={item._id}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default InventoryList;