import React, { useEffect, useState } from "react";
import { fetchInventory, deleteInventoryItem, updateInventoryItem } from "../services/api";
import AddItemForm from "./AddItemForm";

function InventoryList() {
    const [inventory, setInventory] = useState([]);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    // ✅ Consistent category list for both adding and editing
    const categoryOptions = ["Electronics", "Furniture", "Groceries", "Clothing", "Tools", "Other"];

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

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            await deleteInventoryItem(id);
            setInventory((prev) => prev.filter((item) => item._id !== id));
            setSuccessMessage("Item deleted successfully.");
        } catch {
            setError("Failed to delete item.");
        } finally {
            setTimeout(() => setSuccessMessage(""), 3000);
        }
    };

    const handleEditClick = (item) => setEditingItem(item);
    const handleEditChange = (field, value) => setEditingItem((prev) => ({ ...prev, [field]: value }));

    const handleEditSave = async () => {
        try {
            const updated = await updateInventoryItem(editingItem._id, editingItem);
            setInventory((prev) => prev.map((item) => (item._id === editingItem._id ? updated : item)));
            setEditingItem(null);
            setSuccessMessage("Item updated successfully.");
        } catch {
            setError("Failed to update item.");
        } finally {
            setTimeout(() => setSuccessMessage(""), 3000);
        }
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

    const filteredInventory = sortedInventory.filter(
        (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
    const paginatedItems = filteredInventory.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

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
                        placeholder="Search by name or category..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                <button className="btn btn-success" onClick={() => setIsAdding((prev) => !prev)}>
                    ➕ Add Item
                </button>
            </div>

            {isAdding && (
                <AddItemForm
                    categoryOptions={categoryOptions}
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
                        <th onClick={() => handleSort("category")}>
                            Category {sortConfig.key === "category" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                        </th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedItems.length > 0 ? (
                        paginatedItems.map((item) => (
                            <tr key={item._id}>
                                <td>{editingItem?._id === item._id ? <input type="text" className="form-control" value={editingItem.name} onChange={(e) => handleEditChange("name", e.target.value)} /> : item.name}</td>
                                <td>{editingItem?._id === item._id ? <input type="number" className="form-control" value={editingItem.quantity} onChange={(e) => handleEditChange("quantity", e.target.value)} /> : item.quantity}</td>
                                
                                {/* ✅ Category field as a dropdown (consistent with AddItemForm) */}
                                <td>
                                    {editingItem?._id === item._id ? (
                                        <select
                                            className="form-select"
                                            value={editingItem.category}
                                            onChange={(e) => handleEditChange("category", e.target.value)}
                                        >
                                            {categoryOptions.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        item.category || "N/A"
                                    )}
                                </td>

                                <td>
                                    {editingItem?._id === item._id ? (
                                        <>
                                            <button className="btn btn-success btn-sm mx-1" onClick={handleEditSave}>✅ Save</button>
                                            <button className="btn btn-secondary btn-sm mx-1" onClick={() => setEditingItem(null)}>❌ Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="btn btn-primary btn-sm mx-1" onClick={() => handleEditClick(item)}>✏️ Edit</button>
                                            <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDelete(item._id)}>🗑️ Delete</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="4" className="text-center text-muted">No items found.</td></tr>
                    )}
                </tbody>
            </table>

            {/* ✅ Pagination Controls */}
            <div className="d-flex justify-content-between mt-3">
                <button className="btn btn-outline-primary" onClick={handlePrevPage} disabled={currentPage === 1}>⬅️ Prev</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button className="btn btn-outline-primary" onClick={handleNextPage} disabled={currentPage === totalPages}>Next ➡️</button>
            </div>
        </div>
    );
}

export default InventoryList;
