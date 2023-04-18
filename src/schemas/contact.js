const mongoose = require('mongoose');
const Joi = require('joi');
const { handleMongooseError } = require('../services');

const Schema = mongoose.Schema;

const contact = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Set name for contact'],
        },
        email: {
            type: String,
            required: [true, 'Set name for contact'],
        },
        phone: {
            type: String,
        },
        favorite: {
            type: Boolean,
            default: false,
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
    },
    { versionKey: false }
);

contact.post('save', handleMongooseError);

const add = Joi.object({
    name: Joi.string().required().messages({
        'any.required': 'Set name for contact',
    }),
    phone: Joi.string(),
    email: Joi.string().email().required().messages({
        'any.required': 'Email is required',
        'string.email': 'Invalid email format',
    }),
    favorite: Joi.boolean().default(false),
}).unknown(false);

const update = Joi.object({
    name: Joi.string(),
    phone: Joi.string(),
    email: Joi.string().email(),
})
    .or('name', 'phone', 'email')
    .unknown(false);

const updateStatus = Joi.object({
    favorite: Joi.boolean().required(),
}).unknown(false);

const contactSchema = {
    add,
    update,
    updateStatus,
};

const Contact = mongoose.model('contact', contact);

module.exports = { Contact, contactSchema };
