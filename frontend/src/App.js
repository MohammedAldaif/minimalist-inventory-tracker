import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import InventoryPage from "./pages/InventoryPage";

function HomePage() {
    return <h2>Welcome to Minimalist Inventory Tracker</h2>;
}

function App() {
    return (
        <Router>
            <div>
                <nav>
                    <Link to="/">Home</Link> | <Link to="/inventory">Inventory</Link>
                </nav>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/inventory" element={<InventoryPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;