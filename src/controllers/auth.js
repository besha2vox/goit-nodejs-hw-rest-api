const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const { uuid } = require('uuidv4');
const path = require('path');
const fs = require('fs').promises;
const jimp = require('jimp');

const { sendVerificationEmail } = require('../services');

require('dotenv').config();
const { JWT_SECRET } = process.env;

const { HttpError, ctrlWrapper } = require('../helpers');
const { User } = require('../schemas');

const signup = async (req, res, next) => {
    const { subscription, email, password } = req.data;
    const user = await User.findOne({ email });

    if (user) {
        next(HttpError(409, 'Email in use'));
        return;
    }

    const verificationToken = uuid();

    await sendVerificationEmail(email, verificationToken);

    const avatarURL = gravatar.url('email');

    const newUser = new User({
        email,
        password,
        subscription,
        avatarURL,
        verificationToken,
    });

    await newUser.save();

    res.status(201).json({ user: { email, subscription, avatarURL } });
};

const resendVerifyEmail = async (req, res, next) => {
    const { email } = req.body;

    const user = User.findOne({ email });

    if (!user) {
        next(HttpError(404));
        return;
    }

    if (user.verify) {
        next(HttpError(400, 'Verification has already been passed'));
        return;
    }

    const verificationToken = uuid();

    await User.findOneAndUpdate({ email }, { verificationToken });
    await sendVerificationEmail(email, verificationToken);

    res.status(200).json({ message: 'Verification email sent' });
};

const verifyEmail = async (req, res, next) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });

    if (!user) {
        next(HttpError(404));
        return;
    }

    await User.findOneAndUpdate(
        { verificationToken },
        { verify: true, verificationToken: null }
    );

    res.status(200).json({ message: 'Verification successful' });
};

const signin = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        next(HttpError(401, 'Email or password is wrong'));
        return;
    }

    const isCorrect = await bcrypt.compare(password, user.password);

    if (!isCorrect) {
        next(HttpError(401, 'Email or password is wrong'));
        return;
    }

    const { _id, subscription } = user;

    const token = jwt.sign({ _id }, JWT_SECRET);
    user.token = token;

    user.save();

    res.status(200).json({ token, user: { email, subscription } });
};

const logout = async (req, res, next) => {
    const { _id } = req.user;
    const user = await User.findById(_id);

    if (!user || !user.token) {
        next(HttpError(401));
    }

    await User.findOneAndUpdate({ _id }, { $unset: { token: '' } });

    res.status(204).json();
};

const current = async (req, res, next) => {
    const { _id } = req.user;

    const user = await User.findById(_id);

    if (!user) {
        next(HttpError(401));
    }
    const { email, token, subscription } = user;

    if (!token) {
        next(HttpError(401));
        return;
    }

    res.status(200).json({ email, subscription });
};

const updateSubscription = async (req, res, next) => {
    const { _id } = req.user;
    const { subscription } = req.data;

    const result = await User.findByIdAndUpdate(_id, { subscription });

    if (result.subscription === subscription) {
        next(
            HttpError(400, `Subscription "${subscription}" already installed`)
        );
        return;
    }

    res.status(200).json({
        message: `Subscription successfully changed from "${result.subscription}" to "${subscription}"`,
    });
};

const changeAavatar = async (req, res, next) => {
    const { _id } = req.user;
    const { path: temporaryName, originalname } = req.file;
    const storeDir = path.join(process.cwd(), 'public', 'avatars');
    const fileName = `${Date.now()}_${originalname}`;
    const avatarURL = path.join(storeDir, fileName);
    const image = await jimp.read(temporaryName);
    await image.resize(250, 250);
    await image.writeAsync(temporaryName);

    try {
        await fs.rename(temporaryName, avatarURL);
    } catch (err) {
        await fs.unlink(temporaryName);
        return next(err);
    }

    await User.findByIdAndUpdate(_id, { avatarURL });

    res.status(200).json({ avatarURL });
};

module.exports = {
    signup: ctrlWrapper(signup),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    verifyEmail: ctrlWrapper(verifyEmail),
    signin: ctrlWrapper(signin),
    logout: ctrlWrapper(logout),
    current: ctrlWrapper(current),
    updateSubscription: ctrlWrapper(updateSubscription),
    changeAavatar: ctrlWrapper(changeAavatar),
};
