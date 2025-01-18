import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

function InventoryCharts({ inventory, chartType }) {
    if (!inventory || inventory.length === 0) return <p className="text-center">No data available.</p>;

    // 📌 Stock by Category
    const categories = [...new Set(inventory.map(item => item.category))];
    const categoryStock = categories.map(category =>
        inventory.filter(item => item.category === category).reduce((sum, item) => sum + item.quantity, 0)
    );

    const categoryChartData = {
        labels: categories,
        datasets: [{ label: "Stock by Category", data: categoryStock, backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"] }],
    };

    // 📌 Top 5 Stocked Items
    const topItems = [...inventory].sort((a, b) => b.quantity - a.quantity).slice(0, 5);
    const topItemNames = topItems.map(item => item.name);
    const topItemQuantities = topItems.map(item => item.quantity);

    const topItemsChartData = {
        labels: topItemNames,
        datasets: [{ label: "Top Stocked Items", data: topItemQuantities, backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"] }],
    };

    // 📌 Stock Trends Over Time (Dummy Data)
    const stockTrendData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May"],
        datasets: [{ label: "Stock Trend", data: [500, 700, 600, 800, 750], borderColor: "#36a2eb", fill: false }],
    };

    return (
        <div>
            {chartType === "bar" && <Bar data={categoryChartData} />}
            {chartType === "pie" && <Pie data={topItemsChartData} />}
            {chartType === "line" && <Line data={stockTrendData} />}
        </div>
    );
}

export default InventoryCharts;