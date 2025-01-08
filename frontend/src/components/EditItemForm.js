import React, { useState } from "react";
import { updateInventoryItem } from "../services/api";

function EditItemForm({ item, onCancel, onSave }) {
    const [formData, setFormData] = useState({ name: item.name, quantity: item.quantity });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedItem = await updateInventoryItem(item._id, formData);
            onSave(updatedItem);
        } catch (err) {
            console.error("Error updating item:", err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label>Quantity:</label>
                <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                />
            </div>
            <button type="submit">Save</button>
            <button type="button" onClick={onCancel}>Cancel</button>
        </form>
    );
}

export default EditItemForm;