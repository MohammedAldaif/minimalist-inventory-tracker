import React from "react";
import InventoryCharts from "./InventoryCharts";

function Dashboard({ inventory }) {
    return (
        <div className="container mt-4">
            <h2>📊 Inventory Analytics</h2>
            <InventoryCharts inventory={inventory} />
        </div>
    );
}

export default Dashboard;i
