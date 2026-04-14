const mongoose = require('mongoose');

const EVENT_CATEGORIES = ['Marathon', 'Fitness', 'Awareness'];

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date },
  location: { type: String },
  participants: { type: Number },
  image: { type: String },
  imagePublicId: { type: String },
  status: { type: String, enum: ['upcoming', 'past'], default: 'upcoming' },
  category: { type: String, enum: EVENT_CATEGORIES },
  visible: { type: Boolean, default: true },
  link: { type: String },
  order: { type: Number, default: 0 }
}, { timestamps: true });

eventSchema.pre('validate', function normalizeEventData(next) {
  if (this.category === 'Inclusive Fitness') {
    this.category = 'Fitness';
  }

  if (this.status === 'upcoming') {
    this.participants = undefined;
  }

  next();
});

eventSchema.statics.EVENT_CATEGORIES = EVENT_CATEGORIES;

module.exports = mongoose.model('Event', eventSchema);
