const { createMessage } = require('../helpers');
const { HttpError } = require('../helpers');

const validateContact = (schema) => (req, res, next) => {
    const { methods } = req.route;
    const [method] = Object.keys(methods);
    console.log(req.body);
    const { error, value } = schema.validate(req.body, {
        stripUnknown: true,
        abortEarly: false,
    });

    if (error) {
        console.log(error);
        const message = createMessage(error, method);
        next(HttpError(400, message));
    }
    console.log(value, req.body);
    req.data = value;
    next();
};

module.exports = validateContact;
