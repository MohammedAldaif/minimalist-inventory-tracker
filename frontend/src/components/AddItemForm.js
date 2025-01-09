import React, { useState } from "react";

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
        <div className="container mt-4">
            <h2 className="text-center mb-4">Add New Item</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit} className="shadow p-4 bg-light rounded">
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                        Name:
                    </label>
                    <input
                        type="text"
                        id="name"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="quantity" className="form-label">
                        Quantity:
                    </label>
                    <input
                        type="number"
                        id="quantity"
                        className="form-control"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                    Add Item
                </button>
            </form>
        </div>
    );
}

export default AddItemForm;