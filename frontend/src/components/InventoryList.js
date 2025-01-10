import React, { useEffect, useState } from "react";
import { fetchInventory, deleteInventoryItem } from "../services/api";
import EditItemForm from "./EditItemForm";
import AddItemForm from "./AddItemForm";

function InventoryList() {
    const [inventory, setInventory] = useState([]);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState({ key: "name", direction: "asc" });

    const itemsPerPage = 10;

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

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const sortedInventory = [...inventory].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? 1 : -1;
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
                        <th onClick={() => handleSort("name")} style={{ cursor: "pointer" }}>
                            Name {sortConfig.key === "name" && (sortConfig.direction === "asc" ? "⬆️" : "⬇️")}
                        </th>
                        <th onClick={() => handleSort("quantity")} style={{ cursor: "pointer" }}>
                            Quantity {sortConfig.key === "quantity" && (sortConfig.direction === "asc" ? "⬆️" : "⬇️")}
                        </th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedItems.length > 0 ? (
                        paginatedItems.map((item) => (
                            <tr key={item._id}>
                                <td>{editingItem === item._id ? "Editing..." : item.name}</td>
                                <td>{item.quantity}</td>
                                <td>
                                    <button
                                        className="btn btn-primary btn-sm mx-1"
                                        onClick={() => setEditingItem(item._id)}
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm mx-1"
                                        onClick={() => handleDelete(item._id)}
                                    >
                                        🗑️
                                    </button>
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
                    <li
                        className={`page-item ${
                            currentPage === totalPages ? "disabled" : ""
                        }`}
                    >
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
