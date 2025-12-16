const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const GardenItem = require('../models/GardenItem');
const Log = require('../models/Log');

// @route   GET api/garden
// @desc    Get user's garden (active items)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const garden = await GardenItem.find({ user: req.user.id, deleted: { $ne: true } }).populate('plant');
        res.json(garden);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/garden/bin
// @desc    Get user's deleted garden items
// @access  Private
router.get('/bin', auth, async (req, res) => {
    try {
        const garden = await GardenItem.find({ user: req.user.id, deleted: true }).populate('plant');
        res.json(garden);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/garden/:id
// @desc    Get specific garden item
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const gardenItem = await GardenItem.findById(req.params.id).populate('plant');
        if (!gardenItem) {
            return res.status(404).json({ msg: 'Garden item not found' });
        }
        // Allow access if owner, regardless of deleted status (so we can see details in bin if needed)
        if (gardenItem.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        res.json(gardenItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/garden
// @desc    Add plant to user's garden
// @access  Private
router.post('/', auth, async (req, res) => {
    const { plantId, nickname, notes, stage } = req.body;

    try {
        const newGardenItem = new GardenItem({
            user: req.user.id,
            plant: plantId,
            nickname,
            notes,
            stage: stage || 'Seed',
            xp: 0
        });

        const gardenItem = await newGardenItem.save();
        res.json(gardenItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/garden/:id
// @desc    Update garden item (nickname, notes)
// @access  Private
router.put('/:id', auth, async (req, res) => {
    const { nickname, notes, stage } = req.body;
    try {
        let gardenItem = await GardenItem.findById(req.params.id);
        if (!gardenItem) return res.status(404).json({ msg: 'Item not found' });

        if (gardenItem.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        if (nickname) gardenItem.nickname = nickname;
        if (notes) gardenItem.notes = notes;
        if (stage) gardenItem.stage = stage;

        await gardenItem.save();
        res.json(gardenItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/garden/:id/restore
// @desc    Restore a deleted garden item
// @access  Private
router.put('/:id/restore', auth, async (req, res) => {
    try {
        const gardenItem = await GardenItem.findById(req.params.id);
        if (!gardenItem) return res.status(404).json({ msg: 'Item not found' });
        if (gardenItem.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        gardenItem.deleted = false;
        await gardenItem.save();
        res.json(gardenItem);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/garden/:id
// @desc    Soft Delete plant from garden (move to bin)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const gardenItem = await GardenItem.findById(req.params.id);
        if (!gardenItem) {
            return res.status(404).json({ msg: 'Garden item not found' });
        }

        // Check user
        if (gardenItem.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        gardenItem.deleted = true;
        await gardenItem.save();
        res.json({ msg: 'Plant moved to recycle bin' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/garden/:id/permanent
// @desc    Permanently delete plant from garden
// @access  Private
router.delete('/:id/permanent', auth, async (req, res) => {
    try {
        const gardenItem = await GardenItem.findById(req.params.id);
        if (!gardenItem) {
            return res.status(404).json({ msg: 'Garden item not found' });
        }

        if (gardenItem.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        // Delete associated logs first (optional cleaning)
        await Log.deleteMany({ gardenItem: req.params.id });

        await gardenItem.deleteOne();
        res.json({ msg: 'Plant permanently deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/garden/:id/logs
// @desc    Add a growth log
// @access  Private
router.post('/:id/logs', auth, async (req, res) => {
    try {
        const { height, notes, photoUrl } = req.body;
        const gardenItem = await GardenItem.findById(req.params.id);

        if (!gardenItem) return res.status(404).json({ msg: 'Plant not found in garden' });
        if (gardenItem.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

        const newLog = new Log({
            gardenItem: req.params.id,
            height,
            notes,
            photoUrl
        });

        await newLog.save();

        // Gamification Logic: Add XP
        gardenItem.xp = (gardenItem.xp || 0) + 50; // 50 XP per log

        // Simple Level Up Logic
        const levels = {
            'Seed': 0,
            'Sprout': 100,
            'Sapling': 300,
            'Tree': 600,
            'Mature': 1000
        };

        const currentStage = gardenItem.stage || 'Seed';
        let newStage = currentStage;

        if (currentStage === 'Seed' && gardenItem.xp >= levels['Sprout']) newStage = 'Sprout';
        else if (currentStage === 'Sprout' && gardenItem.xp >= levels['Sapling']) newStage = 'Sapling';
        else if (currentStage === 'Sapling' && gardenItem.xp >= levels['Tree']) newStage = 'Tree';
        else if (currentStage === 'Tree' && gardenItem.xp >= levels['Mature']) newStage = 'Mature';

        gardenItem.stage = newStage;
        await gardenItem.save();

        res.json({ log: newLog, gardenItem });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/garden/:id/logs
// @desc    Get logs for a garden item
// @access  Private
router.get('/:id/logs', auth, async (req, res) => {
    try {
        const logs = await Log.find({ gardenItem: req.params.id }).sort({ date: -1 });
        res.json(logs);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/garden/:gardenId/logs/:logId
// @desc    Delete a specific log
// @access  Private
router.delete('/:gardenId/logs/:logId', auth, async (req, res) => {
    try {
        const log = await Log.findById(req.params.logId);

        if (!log) {
            return res.status(404).json({ msg: 'Log not found' });
        }

        // Verify the log belongs to a garden item owned by the user
        const gardenItem = await GardenItem.findById(log.gardenItem);
        if (!gardenItem || gardenItem.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Log.findByIdAndDelete(req.params.logId);
        res.json({ msg: 'Log deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
