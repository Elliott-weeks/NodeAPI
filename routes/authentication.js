const express = require('express');
const router = express.Router();
const authController = require('../controllers/authentication');
router.post('/newUser', authController.createUser);
router.post('/auth', authController.userLogin);


module.exports = router;

