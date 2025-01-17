import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function InventoryCharts({ inventory }) {
    // Extract data from inventory
    const categories = [...new Set(inventory.map(item => item.category))];
    const quantities = categories.map(category =>
        inventory.filter(item => item.category === category).reduce((sum, item) => sum + item.quantity, 0)
    );

    const data = {
        labels: categories,
        datasets: [
            {
                label: "Stock by Category",
                data: quantities,
                backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"],
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Inventory Stock by Category" },
        },
    };

    return <Bar data={data} options={options} />;
}

export default InventoryCharts;
