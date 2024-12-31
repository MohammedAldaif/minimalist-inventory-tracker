const express = require('express');
const router = express.Router();

//Mock data for now
let inventory = [
    {id : 1, name : 'Laptop', quantity : 5},
    {id : 2, name : 'Phone', quantity: 10},
];

//Get all inventory items
router.get('/',(req, res) => {
    res.json(inventory)
});

//Add a new inventory item
router.post('/',(req, res) => {
    const newItem = {id : Date.now(), ...req.body};
    inventory.push(newItem);
    res.status(201).json(newItem);
});

//Update an inventory item
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const index = inventory.findIndex(item => item.id == id);
    if (index === -1) return res.status(404).json({ message: 'Item not found' });

    inventory[index] = { ...inventory[index], ...req.body };
    res.json(inventory[index]);
});

// Delete an inventory item
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const index = inventory.findIndex(item => item.id == id);
    if (index === -1) return res.status(404).json({ message: 'Item not found' });

    const deletedItem = inventory.splice(index, 1);
    res.json(deletedItem);
});

module.exports = router;