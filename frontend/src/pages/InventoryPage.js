import React, { useState } from "react";
import InventoryList from "../components/InventoryList";
import AddItemForm from "../components/AddItemForm";

function InventoryPage() {
    const [inventory, setInventory] = useState([]);

    const handleItemAdded = (newItem) => {
        setInventory([...inventory, newItem]); // Add the new item to the list
    };

    return (
        <div>
            <h1>Inventory Management</h1>
            <AddItemForm onItemAdded={handleItemAdded} />
            <InventoryList inventory={inventory} setInventory={setInventory} />
        </div>
    );
}

export default InventoryPage;