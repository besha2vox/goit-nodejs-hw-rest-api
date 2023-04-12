const mongoose = require('mongoose');
const Joi = require('joi');
const { handleMongooseError, hashingPassword } = require('../services');

const Schema = mongoose.Schema;

const TokenSchema = new mongoose.Schema({
    userAgent: {
        type: String,
    },
    token: {
        type: String,
    },
});

const user = new Schema(
    {
        password: {
            type: String,
            required: [true, 'Set password for user'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
        },
        subscription: {
            type: String,
            enum: ['starter', 'pro', 'business'],
            default: 'starter',
        },
        tokens: {
            type: [TokenSchema],
            default: [],
        },
    },
    { versionKey: false }
);

user.post('save', handleMongooseError);
user.pre('save', async function () {
    await hashingPassword(this);
});

const singup = Joi.object({
    email: Joi.string().email().required().messages({
        'any.required': 'Email is required',
        'string.email': 'Invalid email format',
    }),
    password: Joi.string().required().messages({
        'any.required': 'Set password for user',
    }),
    subscription: Joi.string()
        .valid('starter', 'pro', 'business')
        .default('starter'),
}).unknown(false);

const singin = Joi.object({
    email: Joi.string().email().required().messages({
        'any.required': 'Email is required',
        'string.email': 'Invalid email format',
    }),
    password: Joi.string().required().messages({
        'any.required': 'Set password for user',
    }),
}).unknown(false);

const subscription = Joi.object({
    subscription: Joi.string().required().valid('starter', 'pro', 'business'),
});

const User = mongoose.model('user', user);
const userSchema = {
    singup,
    singin,
    subscription,
};

module.exports = { User, userSchema };