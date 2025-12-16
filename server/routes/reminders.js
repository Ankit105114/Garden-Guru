const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Reminder = require('../models/Reminder');
const GardenItem = require('../models/GardenItem');

// @route   GET api/reminders
// @desc    Get user's reminders
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const reminders = await Reminder.find({ user: req.user.id })
            .populate({
                path: 'gardenItem',
                populate: { path: 'plant' }
            })
            .sort({ date: 1 });
        res.json(reminders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/reminders
// @desc    Add a reminder
// @access  Private
router.post('/', auth, async (req, res) => {
    const { gardenItemId, type, date } = req.body;
    try {
        const newReminder = new Reminder({
            user: req.user.id,
            gardenItem: gardenItemId,
            type,
            date
        });

        const reminder = await newReminder.save();
        res.json(reminder);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/reminders/:id
// @desc    Toggle complete
// @access  Private
router.put('/:id', auth, async (req, res) => {
    try {
        let reminder = await Reminder.findById(req.params.id);
        if (!reminder) return res.status(404).json({ msg: 'Reminder not found' });

        if (reminder.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        reminder.completed = !reminder.completed;
        await reminder.save();
        res.json(reminder);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/reminders/:id
// @desc    Delete reminder
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        let reminder = await Reminder.findById(req.params.id);
        if (!reminder) return res.status(404).json({ msg: 'Reminder not found' });

        if (reminder.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Reminder.findOneAndDelete({ _id: req.params.id });
        res.json({ msg: 'Reminder removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
