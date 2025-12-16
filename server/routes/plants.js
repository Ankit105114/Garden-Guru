const express = require('express');
const router = express.Router();
const Plant = require('../models/Plant');
const auth = require('../middleware/auth');

// @route   GET api/plants
// @desc    Get all plants (with optional search)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};
        if (search) {
            query = { name: { $regex: search, $options: 'i' } };
        }
        const plants = await Plant.find(query);
        res.json(plants);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/plants/:id
// @desc    Get plant by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const plant = await Plant.findById(req.params.id);
        if (!plant) {
            return res.status(404).json({ msg: 'Plant not found' });
        }
        res.json(plant);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Plant not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST api/plants
// @desc    Add a new plant
// @access  Private (Anyone can add)
router.post('/', auth, async (req, res) => {
    const { name, scientificName, waterFrequency, sunlight, fertilizer, pests, imageUrl, careGuide } = req.body;

    try {
        const newPlant = new Plant({
            user: req.user.id, // Track who added it
            name,
            scientificName,
            waterFrequency,
            sunlight,
            fertilizer,
            pests,
            fertilizer,
            pests,
            imageUrl,
            careGuide
        });

        const plant = await newPlant.save();
        res.json(plant);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/plants/:id
// @desc    Update a plant
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { name, scientificName, waterFrequency, sunlight, fertilizer, pests, imageUrl, careGuide } = req.body;
    try {
        let plant = await Plant.findById(req.params.id);
        if (!plant) return res.status(404).json({ msg: 'Plant not found' });

        // Update fields
        if (name) plant.name = name;
        if (scientificName) plant.scientificName = scientificName;
        if (waterFrequency) plant.waterFrequency = waterFrequency;
        if (sunlight) plant.sunlight = sunlight;
        if (fertilizer) plant.fertilizer = fertilizer;
        if (pests) plant.pests = pests;
        if (pests) plant.pests = pests;
        if (imageUrl) plant.imageUrl = imageUrl;
        if (careGuide) plant.careGuide = careGuide;

        await plant.save();
        res.json(plant);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/plants/:id
// @desc    Delete a plant
// @access  Private (Anyone can delete - per user request)
router.delete('/:id', auth, async (req, res) => {
    try {
        const plant = await Plant.findById(req.params.id);
        if (!plant) {
            return res.status(404).json({ msg: 'Plant not found' });
        }

        // Per user request: "able to delete the library plants both admin and client an do it"
        // So we won't check ownership strictly, just authentication.
        await plant.deleteOne();
        res.json({ msg: 'Plant removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
