import React, { useState, useEffect } from "react";
import InventoryList from "../components/InventoryList";
import AddItemForm from "../components/AddItemForm";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function InventoryPage() {
    const [inventory, setInventory] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Monitor authentication state
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return unsubscribe; // Cleanup subscription on unmount
    }, []);

    const handleItemAdded = (newItem) => {
        setInventory([...inventory, newItem]); // Add the new item to the list
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return (
            <div>
                <h1>Inventory Management</h1>
                <p className="text-danger">
                    You must be logged in to access the inventory.
                </p>
            </div>
        );
    }

    return (
        <div>
            <h1>Inventory Management</h1>
            <InventoryList inventory={inventory} setInventory={setInventory} />
        </div>
    );
}

export default InventoryPage;
