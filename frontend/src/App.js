import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import InventoryPage from "./pages/InventoryPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ContactPage from "./pages/ContactPage";
import DashboardPage from "./pages/DashboardPage";  // Only this import remains
import AboutPage from "./pages/AboutPage"
import HomePage from "./pages/HomePage"
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import { useState } from "react"; // Import useState

function App() {
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const [navbarOpen, setNavbarOpen] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div>
        {/* Navigation Bar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/" onClick={() => setNavbarOpen(false)}>
              Inventory Tracker
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded={navbarOpen}
              aria-label="Toggle navigation"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className={`collapse navbar-collapse ${navbarOpen ? "show" : ""}`} id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/" onClick={() => setNavbarOpen(false)}>
                    Home
                  </Link>
                </li>
                {user ? (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/inventory" onClick={() => setNavbarOpen(false)}>
                        Inventory
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/dashboard" onClick={() => setNavbarOpen(false)}>
                        Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/about" onClick={() => setNavbarOpen(false)}>
                        About
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/contact" onClick={() => setNavbarOpen(false)}>
                        Contact
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/" onClick={() => { auth.signOut(); setNavbarOpen(false); }}>
                        Logout
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/login" onClick={() => setNavbarOpen(false)}>
                        Login
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/register" onClick={() => setNavbarOpen(false)}>
                        Register
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="container mt-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/inventory" element={user ? <InventoryPage /> : <LoginPage />} />
            <Route path="/dashboard" element={user ? <DashboardPage /> : <LoginPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;