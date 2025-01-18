import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import InventoryPage from "./pages/InventoryPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ContactPage from "./pages/ContactPage";
import DashboardPage from "./pages/DashboardPage";  // Only this import remains
import AboutPage from "./pages/AboutPage"
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

function HomePage() {
  return <h2>Welcome to Minimalist Inventory Tracker</h2>;
}

function SettingsPage() {
  return <h2>Settings: Customize your application preferences.</h2>;
}

function App() {
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div>
        {/* Navigation Bar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              Inventory Tracker
            </Link>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                    Home
                  </Link>
                </li>
                {user ? (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/inventory">
                        Inventory
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/dashboard">
                        Dashboard
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/about">
                        About
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/contact">
                        Contact
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/settings">
                        Settings
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/" onClick={() => auth.signOut()}>
                        Logout
                      </Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/login">
                        Login
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/register">
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
            <Route path="/settings" element={user ? <SettingsPage /> : <LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
