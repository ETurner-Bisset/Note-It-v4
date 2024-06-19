const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'You must enter a title.'],
      trim: true,
      // unique: [true, 'A note title must be unique.'],
    },
    noteText: {
      type: String,
      trim: true,
    },
    listItems: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Item',
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A note must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
