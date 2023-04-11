const jwt = require('jsonwebtoken');
const { HttpError } = require('../helpers');

const authMiddleware = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        next(HttpError(401));
        return;
    }
    const [tokenType, token] = authorizationHeader.split(' ');

    try {
        const user = jwt.decode(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    } catch (error) {
        next(HttpError(401));
    }
};

module.exports = authMiddleware;
