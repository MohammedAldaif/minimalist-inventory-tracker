const express = require('express');
const router = express.Router();
const Inventory = require('../../models/inventory'); // Correct path to the Inventory model

// Get all inventory items
router.get('/', async (req, res) => {
    try {
        const inventory = await Inventory.find();
        res.json(inventory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a new inventory item
router.post('/', async (req, res) => {
    const newItem = new Inventory(req.body);
    try {
        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
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