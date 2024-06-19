const express = require('express');

const authController = require('../controllers/authController');
const itemController = require('../controllers/itemController');

const router = express.Router();

router.use(authController.protect);

router.route('/:itemId').patch(itemController.itemIsChecked);

router.route('/:itemId/edit').patch(itemController.editItem);

router.route('/:noteId/:itemId').delete(itemController.deleteItem);

module.exports = router;
