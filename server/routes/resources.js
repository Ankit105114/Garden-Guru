const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Resource = require('../models/Resource');

// @route   GET api/resources
// @desc    Get all resources
// @access  Public
router.get('/', async (req, res) => {
    try {
        const resources = await Resource.find().sort({ createdAt: -1 }).populate('user', 'name');
        res.json(resources);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/resources
// @desc    Create a resource
// @access  Private
router.post('/', auth, async (req, res) => {
    const { title, type, description, url, imageUrl } = req.body;

    try {
        const newResource = new Resource({
            user: req.user.id,
            title,
            type,
            description,
            url,
            imageUrl
        });

        const resource = await newResource.save();
        res.json(resource);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/resources/:id
// @desc    Delete a resource
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);

        if (!resource) {
            return res.status(404).json({ msg: 'Resource not found' });
        }

        // Check user (or allow if admin, but keeping simple: owner only for now)
        if (resource.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await resource.deleteOne();
        res.json({ msg: 'Resource removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
