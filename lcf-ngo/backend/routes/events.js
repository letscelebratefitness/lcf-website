const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { protect } = require('../middleware/auth');

const normalizeEventPayload = (payload) => {
  const normalized = { ...payload };

  if (normalized.category === 'Inclusive Fitness') {
    normalized.category = 'Fitness';
  }

  if (normalized.status === 'upcoming') {
    normalized.participants = undefined;
  } else if (normalized.participants === '') {
    normalized.participants = undefined;
  }

  return normalized;
};

// GET /api/events - Public
router.get('/', async (req, res) => {
  try {
    const filter = { visible: true };
    if (req.query.status) filter.status = req.query.status;
    const events = await Event.find(filter).sort({ order: 1, date: -1 });
    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/events/all - Admin: all including hidden
router.get('/all', protect, async (req, res) => {
  try {
    const events = await Event.find().sort({ order: 1, date: -1 });
    res.json({ success: true, data: events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/events/:id
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/events - Admin
router.post('/', protect, async (req, res) => {
  try {
    const event = await Event.create(normalizeEventPayload(req.body));
    res.status(201).json({ success: true, data: event, message: 'Event created' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/events/:id - Admin
router.put('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      normalizeEventPayload(req.body),
      { new: true, runValidators: true }
    );
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, data: event, message: 'Event updated' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/events/:id - Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });
    res.json({ success: true, message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
