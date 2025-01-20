require('dotenv').config({ path: './mongo_uri.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const admin = require('../node_modules/firebase-admin');
const inventoryRoutes = require('./routes/inventoryRoutes');
const verifyToken = require("./middlewares/verifyToken");

// Initialize Firebase Admin SDK
const serviceAccount = require('../service-account-key.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

// Express app setup
const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// MongoDB connection
const connectDB = async () => {
    try {
        // Replace <username>, <password>, and <dbname> with your details
        await mongoose.connect(process.env.mongo_uri);
        console.log('MongoDB connected successfully!');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};
connectDB();

// Protect inventory routes with Firebase authentication
app.use('/api/inventory', verifyToken, inventoryRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the Minimalist Inventory Tracker API!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});