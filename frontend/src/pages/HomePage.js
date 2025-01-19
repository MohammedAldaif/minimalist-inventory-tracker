import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
    return (
        <div>
            {/* 🎯 Hero Section */}
            <header className="bg-primary text-white text-center py-5">
                <div className="container">
                    <h1>📦 Minimalist Inventory Tracker</h1>
                    <p className="lead">Easily manage and track your inventory in real time.</p>
                    <Link to="/register" className="btn btn-light btn-lg mt-3">
                        Get Started 🚀
                    </Link>
                </div>
            </header>

            {/* ⭐ Key Features Section */}
            <section className="container mt-5">
                <h2 className="text-center">⭐ Key Features</h2>
                <div className="row mt-4">
                    <div className="col-md-4">
                        <div className="card shadow-sm p-3 text-center">
                            <h4>📊 Real-time Tracking</h4>
                            <p>Get instant updates on stock levels and avoid running out of inventory.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-sm p-3 text-center">
                            <h4>📉 Analytics & Reports</h4>
                            <p>Gain insights with powerful charts and reports.</p>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-sm p-3 text-center">
                            <h4>🔒 Secure & Cloud-Based</h4>
                            <p>Your data is securely stored and accessible anywhere.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 🛠️ How It Works Section */}
            <section className="bg-light py-5 mt-5">
                <div className="container text-center">
                    <h2>🛠️ How It Works</h2>
                    <div className="row mt-4">
                        <div className="col-md-4">
                            <h4>1️⃣ Register</h4>
                            <p>Create an account to start managing your inventory.</p>
                        </div>
                        <div className="col-md-4">
                            <h4>2️⃣ Add Items</h4>
                            <p>Input your stock and categorize items for easy tracking.</p>
                        </div>
                        <div className="col-md-4">
                            <h4>3️⃣ Monitor & Optimize</h4>
                            <p>Keep track of stock levels and optimize purchases.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 🗣️ Testimonials Section */}
            <section className="container mt-5">
                <h2 className="text-center">🗣️ What Our Users Say</h2>
                <div className="row mt-4">
                    <div className="col-md-6">
                        <div className="card shadow-sm p-3">
                            <p>"This inventory tracker has **saved me hours of work** every week!"</p>
                            <strong>- Ahmed K.</strong>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="card shadow-sm p-3">
                            <p>"A **must-have** for small businesses! Highly recommend it!"</p>
                            <strong>- Sarah M.</strong>
                        </div>
                    </div>
                </div>
            </section>

            {/* 📩 Call to Action */}
            <section className="text-center my-5">
                <h2>📩 Ready to Simplify Your Inventory?</h2>
                <Link to="/register" className="btn btn-primary btn-lg mt-3">
                    Sign Up Now 🚀
                </Link>
            </section>
        </div>
    );
}

export default HomePage;
