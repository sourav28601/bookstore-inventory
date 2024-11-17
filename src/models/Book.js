const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  genre: {
    type: String,
    required: true,
    enum: ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography']
  },
  isbn: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: String,
  stock: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

bookSchema.index({ title: 'text', description: 'text' });
module.exports = mongoose.model('Book', bookSchema);
