import React, { useState, useEffect } from "react";
import InventoryList from "../components/InventoryList";
import AddItemForm from "../components/AddItemForm";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function InventoryPage() {
    const [inventory, setInventory] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Monitor authentication state
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);

            if (currentUser) {
                // Fetch inventory data when the user is authenticated
                currentUser.getIdToken(true).then((token) => {
                    fetch('http://localhost:5000/api/inventory', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error('Failed to fetch inventory');
                            }
                            return response.json();
                        })
                        .then((data) => setInventory(data))
                        .catch((fetchError) => setError(fetchError.message));
                        console.log("fetch error")
                }).catch((tokenError) => setError(tokenError.message));
                console.log("token error")
            }
        });
        return unsubscribe; // Cleanup subscription on unmount
    }, []);

    const handleItemAdded = (newItem) => {
        setInventory([...inventory, newItem]); // Add the new item to the list
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return (
            <div>
                <h1>Inventory Management</h1>
                <p className="text-danger">Error: {error}</p>
            </div>
        );
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
            <AddItemForm onItemAdded={handleItemAdded} />
            <InventoryList inventory={inventory} setInventory={setInventory} />
        </div>
    );
}

export default InventoryPage;