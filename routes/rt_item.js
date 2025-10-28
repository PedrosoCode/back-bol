const express = require('express');
const validateJWT = require('../middlewares/mid_auth')

const {  
  getItem,
  getItemById,
  insertItem,
  updateItem,
  deleteItem
} = require('../controllers/ct_item');

const router = express.Router();

router.post('/insert', validateJWT, insertItem);
router.post('/update', validateJWT, updateItem);
router.post('/select', validateJWT, getItem);
router.post('/select_id', validateJWT, getItemById);
router.post('/delete', validateJWT, deleteItem);

module.exports = router;