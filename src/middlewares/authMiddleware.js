const jwt = require('jsonwebtoken');
const { HttpError } = require('../helpers');
const { JWT_SECRET } = process.env;

const authMiddleware = async (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        next(HttpError(401));
        return;
    }

    const [, token] = authorizationHeader.split(' ');
    if (!token) {
        next(HttpError(401));
        return;
    }

    try {
        const user = jwt.decode(token, process.env.JWT_SECRET);
        const isValide = await jwt.verify(token, JWT_SECRET);

        if (!isValide) {
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
