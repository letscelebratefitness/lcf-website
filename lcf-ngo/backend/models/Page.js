const mongoose = require('mongoose');

const buttonSchema = new mongoose.Schema({
  label: String,
  href: String,
  variant: { type: String, enum: ['primary', 'secondary', 'outline'], default: 'primary' }
}, { _id: false });

const sectionSchema = new mongoose.Schema({
  type: { type: String, required: true },
  visible: { type: Boolean, default: true },
  order: { type: Number, required: true },
  content: { type: mongoose.Schema.Types.Mixed, default: {} }
});

const pageSchema = new mongoose.Schema({
  page: { type: String, required: true, unique: true },
  title: { type: String },
  metaDescription: { type: String },
  sections: [sectionSchema]
}, { timestamps: true });

module.exports = mongoose.model('Page', pageSchema);
