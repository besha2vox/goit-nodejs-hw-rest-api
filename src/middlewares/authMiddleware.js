const jwt = require('jsonwebtoken');
const { HttpError } = require('../helpers');
const { User } = require('../schemas');
const { JWT_SECRET } = process.env;

const authMiddleware = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        next(HttpError(401));
        return;
    }

    const [, token] = authorization.split(' ');
    if (!token) {
        next(HttpError(401));
        return;
    }

    try {
        const isValide = await jwt.verify(token, JWT_SECRET);

        if (!isValide) {
            next(HttpError(401));
            return;
        }

        const { _id } = jwt.decode(token, process.env.JWT_SECRET);
        const user = await User.findById(_id);

        if (!user.token) {
            next(HttpError(401));
            return;
        }
        req.user = user;

        next();
    } catch (error) {
        next(HttpError(401));
    }
};

module.exports = authMiddleware;
