const express = require('express');
const {
    getEmpresas,
    login
} = require('../controllers/ct_login');

const router = express.Router();

router.get('/empresa', getEmpresas);
router.post('/login', login);

module.exports = router;