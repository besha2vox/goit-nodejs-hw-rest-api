const mongoose = require('mongoose');
const Joi = require('joi');
const { handleMongooseError } = require('../helpers');
console.log(handleMongooseError);
const Schema = mongoose.Schema;

const contact = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Set name for contact'],
            unique: true,
        },
        email: {
            type: String,
        },
        phone: {
            type: String,
        },
        favorite: {
            type: Boolean,
            default: false,
        },
    },
    { versionKey: false }
);

contact.post('save', handleMongooseError);

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

const updateStatus = Joi.object({
    favorite: Joi.boolean().required(),
}).unknown(false);

const Contact = mongoose.model('contact', contact);
const contactSchema = {
    add,
    update,
    updateStatus,
};

module.exports = { Contact, contactSchema };
