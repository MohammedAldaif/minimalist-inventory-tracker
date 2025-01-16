import React, { useState } from "react";
import { getAuth } from "firebase/auth";

function AddItemForm({ onItemAdded }) {
    const [itemName, setItemName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            setError("You must be logged in to add items.");
            return;
        }

        // Basic validation for quantity
        if (quantity <= 0) {
            setError("Quantity must be greater than zero.");
            return;
        }

        try {
            setLoading(true); // Indicate loading
            const token = await user.getIdToken(); // Fetch Firebase token

            const response = await fetch("http://localhost:5000/api/inventory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Send token for auth
                },
                body: JSON.stringify({
                    name: itemName,
                    quantity: parseInt(quantity, 10),
                }),
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error("Unauthorized. Please log in again.");
                } else if (response.status === 400) {
                    throw new Error("Invalid request. Check the item details.");
                } else {
                    throw new Error("Failed to add new item. Try again later.");
                }
            }

            const newItem = await response.json();
            onItemAdded(newItem); // Notify parent component about the new item
            setItemName(""); // Reset form
            setQuantity("");
        } catch (err) {
            setError(err.message); // Display error
        } finally {
            setLoading(false); // End loading state
        }
    };

    return (
        <div>
            <h2>Add New Item</h2>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="itemName" className="form-label">
                        Item Name
                    </label>
                    <input
                        type="text"
                        id="itemName"
                        className="form-control"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="quantity" className="form-label">
                        Quantity
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
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Adding..." : "Add Item"}
                </button>
            </form>
        </div>
    );
}

export default AddItemForm;
