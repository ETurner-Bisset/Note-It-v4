const express = require('express');
const noteController = require('../controllers/noteController');
const authController = require('../controllers/authController');
const itemController = require('../controllers/itemController');

const router = express.Router();

router.use(authController.protect);
router.use(noteController.setUserId);

router
  .route('/')
  .get(noteController.getAllNotes)
  .post(itemController.createItem, noteController.createNote);

router.route('/sortAlphabetically').get(noteController.sortNotesByTitle);

router
  .route('/:noteId')
  .get(noteController.getNote)
  .delete(noteController.deleteNote);

router.route('/:noteId/addItem').post(itemController.addItem);

router.route('/:noteId/list').patch(itemController.reorderList);

router.route('/:noteId/title').patch(noteController.editTitle);

router
  .route('/:noteId/noteText')
  .patch(noteController.editNoteText)
  .delete(noteController.deleteText);

router.route('/:noteId/deleteList').patch(noteController.deleteList);

router.route('/searchNotes').post(noteController.getNoteByTitle);

module.exports = router;
