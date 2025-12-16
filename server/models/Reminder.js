const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gardenItem: { type: mongoose.Schema.Types.ObjectId, ref: 'GardenItem', required: true },
    type: { type: String, required: true, enum: ['Water', 'Fertilizer', 'Medicine', 'Pruning', 'Harvesting', 'Other'] },
    date: { type: Date, required: true },
    completed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reminder', reminderSchema);
