import React from "react";

function AboutPage() {
    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">ℹ️ About Us</h2>

            {/* 🏆 Mission & Vision Section */}
            <div className="row">
                <div className="col-md-6">
                    <div className="card shadow-sm p-3">
                        <h4 className="card-title">🎯 Our Mission</h4>
                        <p>
                            Our mission is to provide businesses with a **simple and efficient inventory management system**
                            that helps them **track, manage, and optimize their stock levels** in real-time.
                        </p>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card shadow-sm p-3">
                        <h4 className="card-title">👁️ Our Vision</h4>
                        <p>
                            We aim to become the **leading inventory tracking solution**, ensuring businesses **never run out of stock or overstock**,
                            ultimately helping them save time and money.
                        </p>
                    </div>
                </div>
            </div>

            {/* ⭐ Why Choose Us Section */}
            <div className="row mt-4">
                <div className="col-md-12">
                    <div className="card shadow-sm p-3">
                        <h4 className="card-title">⭐ Why Choose Inventory Tracker?</h4>
                        <ul className="list-group list-group-flush">
                            <li className="list-group-item">✔ **Easy-to-use** interface for seamless inventory management.</li>
                            <li className="list-group-item">✔ **Real-time updates** and stock alerts.</li>
                            <li className="list-group-item">✔ **Secure and cloud-based** system.</li>
                            <li className="list-group-item">✔ **Customizable reports** for better decision-making.</li>
                            <li className="list-group-item">✔ **Supports multiple users** with role-based access.</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* 👨‍💼 Our Team Section (Optional) */}
            <div className="row mt-4">
                <h4 className="text-center">👨‍💼 Meet Our Team</h4>
                <div className="col-md-4 text-center">
                    <div className="card shadow-sm p-3">
                        <img src="https://via.placeholder.com/150" className="rounded-circle mx-auto d-block" alt="Founder" />
                        <h5 className="mt-3">John Doe</h5>
                        <p>Founder & CEO</p>
                    </div>
                </div>
                <div className="col-md-4 text-center">
                    <div className="card shadow-sm p-3">
                        <img src="https://via.placeholder.com/150" className="rounded-circle mx-auto d-block" alt="CTO" />
                        <h5 className="mt-3">Jane Smith</h5>
                        <p>Chief Technology Officer</p>
                    </div>
                </div>
                <div className="col-md-4 text-center">
                    <div className="card shadow-sm p-3">
                        <img src="https://via.placeholder.com/150" className="rounded-circle mx-auto d-block" alt="Developer" />
                        <h5 className="mt-3">Michael Brown</h5>
                        <p>Lead Developer</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;