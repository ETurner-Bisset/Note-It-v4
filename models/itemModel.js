const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    item: String,
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    isChecked: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
