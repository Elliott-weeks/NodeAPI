const express = require('express');
const router = express.Router();
const jwtAuth = require('../controllers/JwtAuthentication');
router.use('/', jwtAuth.checkToken);



module.exports = router;
