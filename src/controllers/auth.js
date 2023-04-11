const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const { HttpError, ctrlWrapper } = require('../helpers');
const { User } = require('../schemas');

const singup = async (req, res, next) => {
    const { subscription, email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        next(HttpError(409, 'Email in use'));
        return;
    }

    const newUser = new User({
        email,
        password,
        subscription,
    });
    await newUser.save();

    res.status(201).json({ email, subscription });
};

const singin = async (req, res, next) => {
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

    const token = jwt.sign({ _id: user._id }, JWT_SECRET);
    const { subscription } = user;

    res.status(201).json({ token, user: { email, subscription } });
};

const logout = async (req, res, next) => {
    const { _id } = req.user;

    const user = await User.findById(_id);

    if (!user) {
        next(HttpError(401));
    }

    res.status(204);
};

const current = async (req, res, next) => {
    const { _id } = req.user;

    const user = await User.findById(_id);

    if (!user) {
        next(HttpError(401));
    }

    const { email, subscription } = user;

    res.status(200).json({ email, subscription });
};

module.exports = {
    singup: ctrlWrapper(singup),
    singin: ctrlWrapper(singin),
    logout: ctrlWrapper(logout),
    current: ctrlWrapper(current),
};
