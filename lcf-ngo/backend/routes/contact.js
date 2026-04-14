const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { protect } = require('../middleware/auth');

// POST /api/contact - Public: submit form
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required' });
    }
    const submission = await Contact.create({ name, email, phone, subject, message });
    res.status(201).json({ success: true, message: 'Message received. We will get back to you soon!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/contact - Admin: list submissions
router.get('/', protect, async (req, res) => {
  try {
    const submissions = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: submissions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/contact/:id/read - Admin: mark as read
router.patch('/:id/read', protect, async (req, res) => {
  try {
    const submission = await Contact.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    res.json({ success: true, data: submission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/contact/:id - Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Submission deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
