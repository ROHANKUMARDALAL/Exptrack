const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authenticate = require('../middlewares/authenticate');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/profile', authenticate, authController.profile);
router.get('/users', authenticate, authController.listUsers);
router.delete('/deleteUser', authenticate, authController.deleteUser);

module.exports = router;
