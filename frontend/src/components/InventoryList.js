import React, { useEffect, useState } from "react";
import { fetchInventory, deleteInventoryItem, updateInventoryItem } from "../services/api";
import AddItemForm from "./AddItemForm";

function InventoryList() {
    const [inventory, setInventory] = useState([]);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null); // Object for the item being edited
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const data = await fetchInventory();
                setInventory(data);
            } catch (err) {
                console.error("Error fetching inventory:", err);
                setError(err.message || "Failed to fetch inventory.");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

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

    const handleEditClick = (item) => {
        setEditingItem(item); // Set the item being edited
    };

    const handleEditChange = (field, value) => {
        setEditingItem((prev) => ({ ...prev, [field]: value })); // Update the field value in editingItem
    };

    const handleEditSave = async () => {
        try {
            const updated = await updateInventoryItem(editingItem._id, editingItem);
            setInventory((prev) =>
                prev.map((item) => (item._id === editingItem._id ? updated : item))
            );
            setEditingItem(null);
            setSuccessMessage("Item updated successfully.");
        } catch (err) {
            setError("Failed to update item.");
        } finally {
            setTimeout(() => setSuccessMessage(""), 3000);
        }
    };

    const handleCancelEdit = () => {
        setEditingItem(null); // Exit edit mode without saving
    };

    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
        setSortConfig({ key, direction });
    };

    const sortedInventory = [...inventory].sort((a, b) => {
        if (sortConfig.key) {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
    });

    const filteredInventory = sortedInventory.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedItems = filteredInventory.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-danger">{error}</div>;

    return (
        <div className="container mt-3">
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="input-group">
                    <span className="input-group-text">🔍</span>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search inventory..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    className="btn btn-success text-white"
                    onClick={() => setIsAdding((prev) => !prev)}
                >
                    ➕
                </button>
            </div>
            {isAdding && (
                <AddItemForm
                    onItemAdded={(newItem) => {
                        setInventory((prev) => [...prev, newItem]);
                        setIsAdding(false);
                        setSuccessMessage("Item added successfully.");
                    }}
                />
            )}
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th onClick={() => handleSort("name")}>
                            Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                        </th>
                        <th onClick={() => handleSort("quantity")}>
                            Quantity {sortConfig.key === "quantity" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                        </th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedItems.length > 0 ? (
                        paginatedItems.map((item) => (
                            <tr key={item._id}>
                                <td>
                                    {editingItem && editingItem._id === item._id ? (
                                        <input
                                            type="text"
                                            value={editingItem.name}
                                            onChange={(e) => handleEditChange("name", e.target.value)}
                                            className="form-control"
                                        />
                                    ) : (
                                        item.name
                                    )}
                                </td>
                                <td>
                                    {editingItem && editingItem._id === item._id ? (
                                        <input
                                            type="number"
                                            value={editingItem.quantity}
                                            onChange={(e) =>
                                                handleEditChange("quantity", e.target.value)
                                            }
                                            className="form-control"
                                        />
                                    ) : (
                                        item.quantity
                                    )}
                                </td>
                                <td>
                                    {editingItem && editingItem._id === item._id ? (
                                        <>
                                            <button
                                                className="btn btn-success btn-sm mx-1"
                                                onClick={handleEditSave}
                                            >
                                                ✅ Save
                                            </button>
                                            <button
                                                className="btn btn-secondary btn-sm mx-1"
                                                onClick={handleCancelEdit}
                                            >
                                                ❌ Cancel
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="btn btn-primary btn-sm mx-1"
                                                onClick={() => handleEditClick(item)}
                                            >
                                                ✏️ Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm mx-1"
                                                onClick={() => handleDelete(item._id)}
                                            >
                                                🗑️ Delete
                                            </button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-muted text-center">
                                No items match your search.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
            <nav>
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button
                            className="page-link"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        >
                            Previous
                        </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <li
                            key={page}
                            className={`page-item ${currentPage === page ? "active" : ""}`}
                        >
                            <button className="page-link" onClick={() => setCurrentPage(page)}>
                                {page}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button
                            className="page-link"
                            onClick={() =>
                                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                            }
                        >
                            Next
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default InventoryList;
