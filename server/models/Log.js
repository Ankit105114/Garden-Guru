const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    gardenItem: { type: mongoose.Schema.Types.ObjectId, ref: 'GardenItem', required: true },
    date: { type: Date, default: Date.now },
    photoUrl: { type: String },
    notes: { type: String },
    height: { type: Number } // height in cm, for example
});

module.exports = mongoose.model('Log', logSchema);
