const User = require('../models/userModel');
const Note = require('../models/noteModel');
const Item = require('../models/itemModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(new AppError('No user found.', 404));
  }
  res.status(200).json({
    status: 'success',
    user,
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }
  const filteredBody = filterObj(req.body, 'name', 'email');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    date: {
      user: updatedUser,
    },
    message: 'Details updated successfully!',
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await Item.deleteMany({ user: req.user.id });
  await Note.deleteMany({ user: req.user.id });
  await User.findByIdAndDelete(req.user.id);
  res
    .status(204)
    .cookie('jwt', 'loggedout', {
      httpOnly: true,
    })
    .json({
      status: 'success',
      data: null,
      message: 'Account Deleted!',
    });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead.',
  });
};
