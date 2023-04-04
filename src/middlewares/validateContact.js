const { createMessage } = require('../helpers');
const { HttpError } = require('../helpers');

const validateContact = (schema) => (req, res, next) => {
    const { methods } = req.route;
    const [method] = Object.keys(methods);
    const { error, value } = schema.validate(req.body, {
        stripUnknown: true,
        abortEarly: false,
    });

    if (error) {
        const message = createMessage(error, method);
        console.log(message);
        next(HttpError(400, message));
    }
    req.data = value;
    next();
};

module.exports = {
    validateContact,
};
