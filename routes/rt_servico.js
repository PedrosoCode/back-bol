const express = require('express');
const validateJWT = require('../middlewares/mid_auth')

const {  
  getServico,
  getServicoById,
  insertServico,
  updateServico,
  deleteServico
} = require('../controllers/ct_servico');

const router = express.Router();

router.post('/insert', validateJWT, insertServico);
router.post('/update', validateJWT, updateServico);
router.post('/select', validateJWT, getServico);
router.post('/select_id', validateJWT, getServicoById);
router.post('/delete', validateJWT, deleteServico);

module.exports = router;