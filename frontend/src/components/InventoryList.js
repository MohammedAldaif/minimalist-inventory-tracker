import React, { useEffect, useState } from "react";
import { fetchInventory, deleteInventoryItem } from "../services/api";
import EditItemForm from "./EditItemForm";

function InventoryList() {
    const [inventory, setInventory] = useState([]);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [searchTerm, setSearchTerm] = useState(""); // State for search
    const [currentPage, setCurrentPage] = useState(1); // State for pagination
    const itemsPerPage = 10; // Number of items per page

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
        setEditingItem(item);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (!confirmDelete) return;

        try {
            await deleteInventoryItem(id);
            setInventory((prev) => prev.filter((item) => item._id !== id));
            setSuccessMessage("Item deleted successfully.");
        } catch (err) {
            setError("Failed to delete item.");
        } finally {
            setTimeout(() => setSuccessMessage(""), 3000);
        }
    };

    // Filtering inventory based on search term
    const filteredInventory = inventory.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredInventory.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-danger">{error}</div>;

    if (editingItem) {
        return (
            <EditItemForm
                item={editingItem}
                onCancel={() => setEditingItem(null)}
                onSave={(updatedItem) => {
                    setInventory((prev) =>
                        prev.map((item) => (item._id === updatedItem._id ? updatedItem : item))
                    );
                    setEditingItem(null);
                    setSuccessMessage("Item updated successfully.");
                }}
            />
        );
    }

    return (
        <div className="container mt-3">
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <div className="input-group my-3">
                <span className="input-group-text">🔍</span>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search inventory..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            {filteredInventory.length > 0 ? (
                <>
                    <ul className="list-group">
                        {currentItems.map((item) => (
                            <li
                                key={item._id}
                                className="list-group-item d-flex justify-content-between align-items-center"
                            >
                                {item.name} - Quantity: {item.quantity}
                                <div>
                                    <button
                                        className="btn btn-primary btn-sm mx-1"
                                        onClick={() => handleEdit(item)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm mx-1"
                                        onClick={() => handleDelete(item._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="d-flex justify-content-between align-items-center mt-3">
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            className="btn btn-outline-secondary"
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    prev < totalPages ? prev + 1 : prev
                                )
                            }
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                </>
            ) : (
                <div className="text-muted">No items match your search.</div>
            )}
        </div>
    );
}

export default InventoryList;