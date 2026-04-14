const express = require('express');
const router = express.Router();
const Page = require('../models/Page');
const { protect } = require('../middleware/auth');

// GET /api/pages/:pageName - Public
router.get('/:pageName', async (req, res) => {
  try {
    const page = await Page.findOne({ page: req.params.pageName });
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
    res.json({ success: true, data: page });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/pages - Admin: list all pages
router.get('/', protect, async (req, res) => {
  try {
    const pages = await Page.find({}, 'page title updatedAt');
    res.json({ success: true, data: pages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/pages/:pageName - Admin: update full page
router.put('/:pageName', protect, async (req, res) => {
  try {
    const page = await Page.findOneAndUpdate(
      { page: req.params.pageName },
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, data: page, message: 'Page updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/pages/:pageName/sections/:sectionIndex - Admin: update single section
router.patch('/:pageName/sections/:sectionIndex', protect, async (req, res) => {
  try {
    const page = await Page.findOne({ page: req.params.pageName });
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
    const idx = parseInt(req.params.sectionIndex);
    if (idx < 0 || idx >= page.sections.length) {
      return res.status(400).json({ success: false, message: 'Invalid section index' });
    }
    page.sections[idx] = { ...page.sections[idx].toObject(), ...req.body };
    await page.save();
    res.json({ success: true, data: page, message: 'Section updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/pages/:pageName/reorder - Admin: reorder sections
router.patch('/:pageName/reorder', protect, async (req, res) => {
  try {
    const { sectionOrders } = req.body; // [{ type, order }]
    const page = await Page.findOne({ page: req.params.pageName });
    if (!page) return res.status(404).json({ success: false, message: 'Page not found' });
    sectionOrders.forEach(({ type, order }) => {
      const sec = page.sections.find(s => s.type === type);
      if (sec) sec.order = order;
    });
    page.sections.sort((a, b) => a.order - b.order);
    await page.save();
    res.json({ success: true, data: page, message: 'Sections reordered' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
