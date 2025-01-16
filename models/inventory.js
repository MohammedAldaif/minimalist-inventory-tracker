const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true }, // ✅ Add category field
    quantity: { type: Number, required: true },
    userId: { type: String, required: true }, // Associate the item with a Firebase user
});

const Inventory = mongoose.model("Inventory", inventorySchema);
module.exports = Inventory;