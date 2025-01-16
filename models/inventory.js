const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    userId: { type: String, required: true }, // Add userId to associate the item with the Firebase user
});

const Inventory = mongoose.model("Inventory", inventorySchema);
module.exports = Inventory;