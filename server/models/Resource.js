const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    type: {
        type: String,
        enum: ['Book', 'Article', 'Blog', 'Video', 'Other'],
        default: 'Article'
    },
    description: { type: String },
    url: { type: String }, // Link to external resource
    imageUrl: { type: String }, // Cover image
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Resource', resourceSchema);
