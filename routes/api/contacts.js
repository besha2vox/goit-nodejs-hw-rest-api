const express = require('express');
const Joi = require('joi');
const contacts = require('../../models/contacts');

const router = express.Router();

const contactShema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().required(),
});

router.get('/', async (req, res, next) => {
    try {
        const result = await contacts.listContacts();
        res.status(200).json({
            status: 'success',
            code: 200,
            data: result,
            totalHints: result.length,
        });
    } catch (error) {
        next(error);
    }
});

router.get('/:contactId', async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const result = await contacts.getContactById(contactId);

        if (!result) {
            next();
            return;
        }
        res.status(200).json({
            status: 'success',
            code: 200,
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { error } = contactShema.validate(req.body);

        if (error) {
            res.status(400).json({ message: 'missing fields' });
            return;
        }

        const result = await contacts.addContact(req.body);

        if (!result) {
            res.status(400).json({
                message: 'contact with this phone number is exists',
            });
            return;
        }

        res.status(200).json({
            status: 'success',
            code: 201,
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

router.delete('/:contactId', async (req, res, next) => {
    try {
        const { contactId } = req.params;
        const result = await contacts.removeContact(contactId);

        if (!result) {
            next();
            return;
        }

        res.status(200).json({
            status: 'success',
            code: 200,
            message: 'contact deleted',
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

router.put('/:contactId', async (req, res, next) => {
    try {
        const { error } = contactShema.validate(req.body);
        if (error) {
            res.status(400).json({ message: 'missing fields' });
            return;
        }

        const { contactId } = req.params;
        const result = await contacts.updateContact(contactId, req.body);
        res.status(200).json({
            status: 'success',
            code: 200,
            message: 'contact deleted',
            data: result,
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
