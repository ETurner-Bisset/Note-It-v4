const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // secure: process.env.NODE_ENV === 'production',
  });

  //   Remove the password from the output
  user.password = undefined;
  res.status(statusCode).json({
    status: 'success',

    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return next(
      new AppError(
        'Email address already exists, please choose another or try logging in instead.',
        422
      )
    );
  } else {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      notes: [],
    });
    // console.log(req.get('host'));
    try {
      const token = signToken(newUser.id);
      const url = `${req.protocol}://localhost:5173/signupConfirm/${token}`;
      await new Email(newUser, url).sendWelcome();
      res.status(201).json({
        status: 'success',
        message: 'Token sent by email.',
      });
    } catch (error) {
      console.log(error);
      return next(new AppError(error, 500));
    }
  }
});

exports.confirmSignup = catchAsync(async (req, res, next) => {
  const { token } = req.params;

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3.  Check if user still exists
  const user = await User.findById(decoded.id).select('+isValidated');
  if (!user) {
    return next(
      new AppError('The user belonging to this token does not exist.', 401)
    );
  }
  if (user.isValidated) {
    return next(new AppError('This account has already been validated.', 400));
  }
  user.isValidated = true;
  await user.save({ validateBeforeSave: false });
  res.user = user;
  createSendToken(user, 200, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //   1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  //   2) Check if user is correct and password is correct and user is validated
  const user = await User.findOne({ email }).select('+password +isValidated');
  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  if (!(await user.isValidated)) {
    return next(new AppError('Email address not validated.', 401));
  }

  if (!user || !(await user.correctPassword(password, user.password))) {
    // Check max login attempts
    if (user.failedLoginAttempts === 3) {
      await User.findOneAndUpdate(
        { email },
        {
          $set: { lockUntil: Date.now() + 60 * 60 * 1000 },
        },
        { new: true }
      );
      return next(
        new AppError(
          'Too many incorrect login attempts, please try again in an hour.'
        )
      );
    }
    await User.findOneAndUpdate(
      { email },
      { $inc: { failedLoginAttempts: 1 } },
      { new: true }
    );

    return next(new AppError('Incorrect email or password', 401));
  }
  // Check lockUntil date

  if (user.lockUntil >= new Date(Date.now())) {
    return next(new AppError('Account locked, please try again later.'));
  }
  //   3) If OK, send token to client
  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;
  await user.save({ validateBeforeSave: false });
  createSendToken(user, 200, res);
});

exports.logout = (req, res, next) => {
  res.cookie('jwt', 'loggedout', {
    httpOnly: true,
  });
  res
    .status(200)
    .json({ status: 'success', message: 'Logged out successfully!' });
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // console.log(req.cookies);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // console.log('here');

  if (!token) {
    return next(
      new AppError(
        'You must be logged in to perform that action. Please log in.',
        401
      )
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token no longer exists.', 401)
    );
  }
  if (currentUser.passwordChangedAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password. Please log in again.', 401)
    );
  }
  req.user = currentUser;

  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no account with that email.', 404));
  }
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });
  try {
    const resetURL = `${req.protocol}://localhost:5173/resetPassword/${resetToken}`;
    await new Email(user, resetURL).sendResetPassword();
    res.status(200).json({
      status: 'success',
      message: 'Reset link sent to email!',
    });
  } catch (error) {
    // console.log(error);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending the email.', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError('Reset token is invalid or has expired.', 400));
  }
  try {
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    const url = `${req.protocol}://localhost:5173/`;
    await new Email(user, url).sendAfterReset();
    createSendToken(user, 200, res);
  } catch (error) {
    // console.log(error);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new AppError('There was an error sending the email.', 500));
  }
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is not correct.', 401));
  }
  if (req.body.password !== req.body.passwordConfirm) {
    return next(
      new AppError('Your new password and confirm password do not match.', 401)
    );
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  res
    .cookie('jwt', 'loggedout', {
      httpOnly: true,
    })
    .json({ status: 'success' });
});
