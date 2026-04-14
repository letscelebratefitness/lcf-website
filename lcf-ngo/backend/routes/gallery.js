const express = require('express');
const router = express.Router();
const Gallery = require('../models/Gallery');
const { protect } = require('../middleware/auth');

// GET /api/gallery - Public
router.get('/', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 50);
    const filter = { visible: true };
    if (req.query.category) filter.category = req.query.category;

    const [images, total, categories] = await Promise.all([
      Gallery.find(filter)
        .sort({ order: 1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Gallery.countDocuments(filter),
      Gallery.distinct('category', { visible: true })
    ]);

    res.json({
      success: true,
      data: images,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
        categories: categories.filter(Boolean)
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/gallery/all - Admin
router.get('/all', protect, async (req, res) => {
  try {
    const images = await Gallery.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, data: images });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/gallery - Admin
router.post('/', protect, async (req, res) => {
  try {
    const image = await Gallery.create(req.body);
    res.status(201).json({ success: true, data: image, message: 'Image added to gallery' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/gallery/:id - Admin
router.put('/:id', protect, async (req, res) => {
  try {
    const image = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
    res.json({ success: true, data: image, message: 'Image updated' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/gallery/:id - Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const image = await Gallery.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
    res.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
