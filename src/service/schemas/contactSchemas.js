const Joi = require('joi');

const add = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    favorite: Joi.boolean(),
}).unknown(false);

const update = Joi.object({
    name: Joi.string(),
    phone: Joi.string(),
    email: Joi.string().email(),
})
    .or('name', 'phone', 'email')
    .unknown(false);

module.exports = {
    add,
    update,
};
