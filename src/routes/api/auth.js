const express = require('express');
const { authCtrl } = require('../../controllers');
const { validateJoi, authMiddleware, upload } = require('../../middlewares');
const { userSchema } = require('../../schemas');

const router = express.Router();

router.post('/register', validateJoi(userSchema.signup), authCtrl.signup);

router.get('/verify/:verificationToken', authCtrl.verifyEmail);

router.post('/login', validateJoi(userSchema.signin), authCtrl.signin);

router.post('/logout', authMiddleware, authCtrl.logout);

router.get('/current', authMiddleware, authCtrl.current);

router.patch(
    '/avatars',
    authMiddleware,
    upload.single('avatar'),
    authCtrl.changeAavatar
);

router.patch(
    '/',
    authMiddleware,
    validateJoi(userSchema.subscription),
    authCtrl.updateSubscription
);

module.exports = router;
