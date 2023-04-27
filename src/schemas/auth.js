const mongoose = require('mongoose');
const Joi = require('joi');
const { handleMongooseError, hashingPassword } = require('../services');

const Schema = mongoose.Schema;

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
        token: String,
        avatarURL: String,
        verify: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
            required: [true, 'Verify token is required'],
        },
    },
    { versionKey: false }
);

user.post('save', handleMongooseError);
user.pre('save', async function () {
    await hashingPassword(this);
});

const signup = Joi.object({
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

const signin = Joi.object({
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

const emailVerify = Joi.object({
    email: Joi.string().email().required().messages({
        'any.required': 'Email is required',
        'string.email': 'Invalid email format',
    }),
});

const User = mongoose.model('user', user);
const userSchema = {
    signup,
    signin,
    subscription,
    emailVerify,
};

module.exports = { User, userSchema };
