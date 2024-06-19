const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Item = require('../models/itemModel');
const Note = require('../models/noteModel');

exports.createItem = catchAsync(async (req, res, next) => {
  let newItems = [];
  for (let i = 0; i < req.body.listItems.length; i++) {
    const newItem = await Item.create({
      item: req.body.listItems[i],
      user: req.user.id,
    });
    newItems.push(newItem.id);
  }
  req.itemArr = newItems;
  next();
});

exports.addItem = catchAsync(async (req, res, next) => {
  const item = await Item.create({
    item: req.body.item,
    user: req.user.id,
  });
  const note = await Note.findOneAndUpdate(
    { _id: req.params.noteId },
    { $push: { listItems: item } },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!note) {
    return next(new AppError('No document found with that ID', 404));
  }
  res.status(201).json({
    status: 'success',
    item,
    message: 'New item added!',
  });
});

exports.editItem = catchAsync(async (req, res, next) => {
  const item = await Item.findByIdAndUpdate(
    req.params.itemId,
    { item: req.body.item },
    { new: true }
  );
  if (!item) {
    return next(new AppError('No item found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    item,
    message: 'Item updated!',
  });
});

exports.deleteItem = catchAsync(async (req, res, next) => {
  const item = await Item.findByIdAndDelete(req.params.itemId);
  if (!item) {
    return next(new AppError('No item found with that ID', 404));
  }
  const note = await Note.findOneAndUpdate(
    { _id: req.params.noteId },
    { $pull: { listItems: item._id } },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!note) {
    return next(new AppError('No document found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    message: 'Item deleted!',
  });
});

exports.itemIsChecked = catchAsync(async (req, res, next) => {
  const item = await Item.findByIdAndUpdate(
    req.params.itemId,
    [{ $set: { isChecked: { $not: '$isChecked' } } }],
    { new: true }
  );
  if (!item) {
    return next(new AppError('No item found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    item,
    message: 'Toggled item done!',
  });
});

exports.reorderList = catchAsync(async (req, res, next) => {
  const note = await Note.findByIdAndUpdate(
    req.params.noteId,
    { $set: { listItems: req.body } },
    { new: true }
  );
  if (!note) {
    return next(new AppError('No document found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    note,
    message: 'List reordered!',
  });
});
