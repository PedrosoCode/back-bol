const express = require('express');
const validateJWT = require('../middlewares/mid_auth')

const {  
    getPais,
    getCidade,
    getEstado,
} = require('../controllers/ct_generico');

const router = express.Router();

router.get('/pais', getPais);
router.post('/cidade', getCidade);
router.get('/estado', getEstado);

module.exports = router;