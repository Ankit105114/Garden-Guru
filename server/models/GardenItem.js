const mongoose = require('mongoose');

const gardenItemSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plant: { type: mongoose.Schema.Types.ObjectId, ref: 'Plant', required: true },
    nickname: { type: String },
    plantedDate: { type: Date, default: Date.now },
    notes: { type: String },
    stage: {
        type: String,
        enum: ['Seed', 'Sprout', 'Sapling', 'Tree', 'Mature'],
        default: 'Seed'
    },
    xp: { type: Number, default: 0 },
    deleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GardenItem', gardenItemSchema);
