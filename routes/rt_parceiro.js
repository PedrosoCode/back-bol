const express = require('express');
const validateJWT = require('../middlewares/auth')

const {  
  getParceiro,
  getParceiroPorId,
  updateParceiro,
  insertParceiro,
  DeleteParceiro
} = require('../controllers/ct_parceiro');

const router = express.Router();

router.post('/insert', validateJWT, insertParceiro);
router.post('/update', validateJWT, updateParceiro);
router.post('/select', validateJWT, getParceiro);
router.post('/select_id', validateJWT, getParceiroPorId);
router.post('/delete', validateJWT, DeleteParceiro);

module.exports = router;