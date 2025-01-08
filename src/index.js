const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const inventoryRoutes = require('./routes/inventoryRoutes'); // Adjust the path if necessary
require('dotenv').config({path: 'mongo_uri'});
//
console.log("log Mongo URI:", process.env.MONGO_URI); // Debugging step
const app = express();
app.use(express.json());
app.use(cors());
// MongoDB connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect("mongodb+srv://MohammedAbdalla:Elex21%401996@cluster0.ssmnh.mongodb.net/inventoryApp?retryWrites=true&w=majority", {useUnifiedTopology:true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1); // Exit the process if the connection fails
    });

// Routes
app.use('/api/inventory', inventoryRoutes);

// Default route
app.get('/', (req, res) => {
    res.send('Welcome to the Minimalist Inventory Tracker API!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});