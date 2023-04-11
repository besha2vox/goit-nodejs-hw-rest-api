const express = require('express');
const { authCtrl } = require('../../controllers');
const { validateJoi, authMiddleware } = require('../../middlewares');
const { userSchema } = require('../../schemas');

const router = express.Router();

router.post('/register', validateJoi(userSchema.singup), authCtrl.singup);

router.post('/login', validateJoi(userSchema.singin), authCtrl.singin);

router.post('/logout', authMiddleware, authCtrl.logout);

router.get('/current', authMiddleware, authCtrl.current);

module.exports = router;
