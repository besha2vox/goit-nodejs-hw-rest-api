const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const { HttpError, ctrlWrapper } = require('../helpers');
const { User } = require('../schemas');

const singup = async (req, res, next) => {
    const { subscription, email, password } = req.data;
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

    const { _id, subscription } = user;

    const token = jwt.sign({ _id }, JWT_SECRET);

    user.token = token;

    user.save();

    res.status(201).json({ token, user: { email, subscription } });
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

module.exports = {
    singup: ctrlWrapper(singup),
    singin: ctrlWrapper(singin),
    logout: ctrlWrapper(logout),
    current: ctrlWrapper(current),
    updateSubscription: ctrlWrapper(updateSubscription),
};
