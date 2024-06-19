const Note = require('../models/noteModel');
const Item = require('../models/itemModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.setUserId = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllNotes = catchAsync(async (req, res, next) => {
  const notes = await Note.findOne({ user: req.user.id });
  if (notes.length === 0 || !notes) {
    return next(new AppError('No notes for this user were found.', 404));
  }
  res.status(200).json({
    status: 'success',
    results: notes.length,
    notes,
  });
});

exports.getNote = catchAsync(async (req, res, next) => {
  const note = await Note.findById(req.params.noteId).populate({
    path: 'listItems',
  });
  if (!note) {
    return next(new AppError('Note not found.', 404));
  }
  res.status(200).json({
    status: 'success',
    note,
  });
});

exports.createNote = catchAsync(async (req, res, next) => {
  const existingNotesArray = await Note.find({ user: req.body.user });
  // console.log(existingNotesArray);
  const existingNote = existingNotesArray.filter(
    (note) => note.title === req.body.title
  );
  // console.log(existingNote);
  if (existingNote.length > 0) {
    return next(
      new AppError('Note title already in use, please choose another', 422)
    );
  }
  const note = await Note.create({
    title: req.body.title,
    noteText: req.body.noteText,
    listItems: [...req.itemArr],
    user: req.body.user,
  });
  await User.findByIdAndUpdate(
    req.user.id,
    { $push: { notes: note._id } },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(201).json({
    status: 'success',
    note,
  });
});

exports.deleteNote = catchAsync(async (req, res, next) => {
  await Item.deleteMany({ user: req.user.id });
  const note = await Note.findByIdAndDelete(req.params.noteId);
  if (!note) {
    return next(new AppError('No note found with that ID', 404));
  }
  await User.findByIdAndUpdate(req.user.id, { $pull: { notes: note._id } });
  res.status(204).json({
    status: 'success',
    message: 'Note deleted.',
  });
});

exports.editTitle = catchAsync(async (req, res, next) => {
  const { title } = req.body;
  const existingNotesArray = await Note.find({ user: req.body.user });
  const existingNote = existingNotesArray.filter(
    (note) => note.title === title
  );
  if (existingNote.length !== 0) {
    return next(
      new AppError('Note title already in use, please choose another', 422)
    );
  }
  const note = await Note.findByIdAndUpdate(
    req.params.noteId,
    { title },
    { new: true, runValidators: true }
  );
  if (!note) {
    return next(new AppError('No note found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    note,
    message: 'Title updated!',
  });
});

exports.editNoteText = catchAsync(async (req, res, next) => {
  const { noteText } = req.body;
  const note = await Note.findByIdAndUpdate(
    req.params.noteId,
    { noteText },
    { new: true }
  );
  if (!note) {
    return next(new AppError('No document found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    note,
    message: 'Note text updated!',
  });
});

exports.deleteText = catchAsync(async (req, res, next) => {
  const note = await Note.findByIdAndUpdate(
    req.params.noteId,
    { noteText: '' },
    { new: true }
  );
  if (!note) {
    return next(new AppError('No document found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    note,
    message: 'Note text deleted!',
  });
});

exports.deleteList = catchAsync(async (req, res, next) => {
  const itemIds = await Note.findById(req.params.noteId);
  itemIds.itemsArr.forEach(async (item) => {
    await Item.findByIdAndDelete(item);
  });
  const note = await Note.findByIdAndUpdate(
    req.params.noteId,
    { itemsArr: [] },
    { new: true }
  );
  if (!note) {
    return next(new AppError('No document found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    note,
  });
});

exports.getNoteByTitle = catchAsync(async (req, res, next) => {
  const note = await Note.findOne({ title: req.body.title });
  if (!note) {
    return next(new AppError('No note found with that title', 404));
  }
  res.status(200).json({
    status: 'success',
    note,
    message: 'Note found!',
  });
});

exports.sortNotesByTitle = catchAsync(async (req, res, next) => {
  const notes = await Note.find({ user: req.user.id }).sort([['title', 1]]);
  if (!notes) {
    return next(new AppError('No notes found for that user', 404));
  }
  res.status(200).json({
    status: 'success',
    notes,
  });
});
