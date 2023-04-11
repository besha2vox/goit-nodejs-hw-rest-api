const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const { HttpError, ctrlWrapper } = require('../helpers');
const { User } = require('../schemas');

const singup = async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
        next(HttpError(409, 'Email in use'));
        return;
    }

    const newUser = new User({
        name,
        email,
        password,
    });
    await newUser.save();
    delete newUser.password;
    res.status(201).json(newUser);
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

    res.status(201).json({ user, token });
};

module.exports = {
    singup: ctrlWrapper(singup),
    singin: ctrlWrapper(singin),
};
