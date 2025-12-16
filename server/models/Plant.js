const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    scientificName: { type: String },
    waterFrequency: { type: String }, // e.g. "Every 3 days"
    sunlight: { type: String }, // e.g. "Full Sun"
    fertilizer: { type: String },
    pests: { type: String },
    imageUrl: { type: String },
    careGuide: { type: String }, // Detailed markdown/text guide for care
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Plant', plantSchema);
