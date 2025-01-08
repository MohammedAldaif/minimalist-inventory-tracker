import React, { useState } from "react";
import { fetchInventory } from "../services/api";

function AddItemForm({ onItemAdded }) {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:3000/api/inventory", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, quantity }),
            });
            if (!response.ok) {
                throw new Error("Failed to add item");
            }
            const newItem = await response.json();
            onItemAdded(newItem); // Notify parent component
            setName("");
            setQuantity("");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>Add New Item</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Name:
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Quantity:
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            required
                        />
                    </label>
                </div>
                <button type="submit">Add Item</button>
            </form>
        </div>
    );
}

export default AddItemForm;