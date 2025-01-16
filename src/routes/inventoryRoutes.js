const express = require('express');
const router = express.Router();
const Inventory = require('../../models/inventory'); // Correct path to the Inventory model
const verifyToken = require("../middlewares/verifyToken");

router.get("/", verifyToken, async (req, res) => {
    const userId = req.user.uid;

    try {
        const items = await Inventory.find({ userId });
        res.json(items);
    } catch (error) {
        console.error("Error fetching items:", error.message);
        res.status(500).json({ message: "Failed to fetch items." });
    }
});

router.post("/", verifyToken, async (req, res) => {
    const { name, quantity } = req.body;
    const userId = req.user.uid; // Extract the userId from the Firebase token

    try {
        const newItem = new Inventory({ name, quantity, userId });
        await newItem.save();
        res.status(201).json(newItem);
    } catch (error) {
        console.error("Error saving item:", error.message);
        res.status(500).json({ message: "Failed to save the item." });
    }
});

// Update an inventory item
router.put('/:id', async (req, res) => {
    try {
        const updatedItem = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete an inventory item
router.delete('/:id', async (req, res) => {
    try {
        const deletedItem = await Inventory.findByIdAndDelete(req.params.id);
        if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
        res.json(deletedItem);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;