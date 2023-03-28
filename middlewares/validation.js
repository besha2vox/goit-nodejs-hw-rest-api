const Joi = require('joi');

const schema = {
    add: Joi.object({
        name: Joi.string().required(),
        phone: Joi.string().required(),
        email: Joi.string().email().required(),
    }).unknown(false),
    update: Joi.object({
        name: Joi.string(),
        phone: Joi.string(),
        email: Joi.string().email(),
    })
        .or('name', 'phone', 'email')
        .unknown(false),
};

const addValidation = (req, res, next) => {
    const { error, value } = schema.add.validate(req.body, {
        stripUnknown: true,
        abortEarly: false,
    });

    if (error) {
        const missingFields = error.details.map(({ context }) => context.key);
        const message =
            missingFields.length > 1
                ? `missing required fields: ${missingFields.join(', ')}`
                : `missing required ${missingFields[0]} field`;

        res.status(400).json({
            message,
        });
        return;
    }
    req.data = value;
    next();
};

const updateValidation = (req, res, next) => {
    const { error, value } = schema.update.validate(req.body, {
        stripUnknown: true,
    });

    if (error) {
        res.status(400).json({
            message: 'missing fields',
        });
        return;
    }
    req.data = value;
    next();
};

module.exports = { addValidation, updateValidation };
