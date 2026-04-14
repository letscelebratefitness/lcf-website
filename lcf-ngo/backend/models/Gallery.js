const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  title: { type: String },
  url: { type: String, required: true },
  publicId: { type: String },
  category: { type: String, default: 'general' },
  visible: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  alt: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
