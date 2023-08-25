const express = require('express');

const router = express.Router();
const { auth } = require('../middleware/authentication');
const authController = require('../controllers/authController');

router.post('/', auth, authController.handleLogin);

module.exports = router;
