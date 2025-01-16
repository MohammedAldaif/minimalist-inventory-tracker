import React, { useState } from "react";

function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement email sending logic (Backend API or Firebase)
    setSubmitted(true);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Contact Us</h2>

      <div className="row">
        {/* Contact Form Section */}
        <div className="col-md-6">
          <h4>Send Us a Message</h4>
          {submitted ? (
            <div className="alert alert-success">Your message has been sent!</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Message</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Contact Info Section */}
        <div className="col-md-6">
          <h4>Contact Information</h4>
          <p>
            <strong>Email:</strong> support@example.com
          </p>
          <p>
            <strong>Phone:</strong> +123 456 7890
          </p>
          <p>
            <strong>Address:</strong> 123 Inventory Street, Tech City
          </p>

          <h5 className="mt-4">Follow Us</h5>
          <div>
            <a href="#" className="btn btn-outline-primary me-2">
              <i className="bi bi-facebook"></i> Facebook
            </a>
            <a href="#" className="btn btn-outline-info me-2">
              <i className="bi bi-twitter"></i> Twitter
            </a>
            <a href="#" className="btn btn-outline-danger">
              <i className="bi bi-instagram"></i> Instagram
            </a>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-5">
        <h4>Frequently Asked Questions (FAQs)</h4>
        <div className="accordion" id="faqAccordion">
          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq1"
              >
                How do I add a new inventory item?
              </button>
            </h2>
            <div id="faq1" className="accordion-collapse collapse show">
              <div className="accordion-body">
                Navigate to the Inventory page and click on "Add New Item."
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq2"
              >
                How do I update an inventory item?
              </button>
            </h2>
            <div id="faq2" className="accordion-collapse collapse">
              <div className="accordion-body">
                Go to the Inventory page, find the item, and click on the edit button.
              </div>
            </div>
          </div>

          <div className="accordion-item">
            <h2 className="accordion-header">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#faq3"
              >
                Can I delete items permanently?
              </button>
            </h2>
            <div id="faq3" className="accordion-collapse collapse">
              <div className="accordion-body">
                Yes, but deleted items cannot be recovered.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;