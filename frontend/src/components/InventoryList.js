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

    const categoryOptions = ["Electronics", "Furniture", "Groceries", "Clothing", "Tools", "Other"];
    const LOW_STOCK_THRESHOLD = 10; // ✅ Low Stock Limit

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
            {/* ✅ Success Message */}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

            {/* ✅ Low Stock Warning */}
            {inventory.some((item) => item.quantity <= LOW_STOCK_THRESHOLD) && (
                <div className="alert alert-warning d-flex align-items-center" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    <strong>Warning:</strong> Some items are low on stock! Please restock soon.
                </div>
            )}

            {/* ✅ Search Bar & Add Item */}
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

            {/* ✅ Add Item Form */}
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

            {/* ✅ Inventory Table */}
            <table className="table">
                <thead className="table-dark">
                    <tr>
                        <th onClick={() => handleSort("name")}>Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
                        <th onClick={() => handleSort("quantity")}>Quantity {sortConfig.key === "quantity" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
                        <th onClick={() => handleSort("category")}>Category {sortConfig.key === "category" && (sortConfig.direction === "asc" ? "↑" : "↓")}</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedItems.length > 0 ? (
                        paginatedItems.map((item) => (
                            <tr key={item._id} className={item.quantity <= LOW_STOCK_THRESHOLD ? "table-warning" : ""}>
                                {editingItem && editingItem._id === item._id ? (
                                    <>
                                        <td>
                                            <input
                                                type="text"
                                                value={editingItem.name}
                                                onChange={(e) => handleEditChange("name", e.target.value)}
                                                className="form-control"
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                value={editingItem.quantity}
                                                onChange={(e) => handleEditChange("quantity", Number(e.target.value))}
                                                className="form-control"
                                            />
                                        </td>
                                        <td>
                                            <select
                                                className="form-select"
                                                value={editingItem.category}
                                                onChange={(e) => handleEditChange("category", e.target.value)}
                                            >
                                                {categoryOptions.map((cat) => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <button className="btn btn-success btn-sm mx-1" onClick={handleEditSave}>💾 Save</button>
                                            <button className="btn btn-secondary btn-sm mx-1" onClick={() => setEditingItem(null)}>❌ Cancel</button>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.category || "N/A"}</td>
                                        <td>
                                            <button className="btn btn-primary btn-sm mx-1" onClick={() => handleEditClick(item)}>✏️ Edit</button>
                                            <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDelete(item._id)}>🗑️ Delete</button>
                                        </td>
                                    </>
                                )}
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="4" className="text-center text-muted">No items found.</td></tr>
                    )}
                </tbody>
            </table>

            {/* ✅ Pagination */}
            <div className="d-flex justify-content-between">
                <button className="btn btn-outline-primary" disabled={currentPage === 1} onClick={handlePrevPage}>⬅️ Previous</button>
                <button className="btn btn-outline-primary" disabled={currentPage === totalPages} onClick={handleNextPage}>Next ➡️</button>
            </div>
        </div>
    );
}

export default InventoryList;