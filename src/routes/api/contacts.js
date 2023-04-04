const express = require('express');
const {
    getAll,
    getById,
    add,
    remove,
    update,
} = require('../../controllers/contacts.js');
const { validateContact } = require('../../middlewares/validateContact.js');
const { contactSchemas } = require('../../schemas');

const router = express.Router();

router.get('/', getAll);

router.get('/:contactId', getById);

router.post('/', validateContact(contactSchemas.add), add);

router.delete('/:contactId', remove);

router.put('/:contactId', validateContact(contactSchemas.update), update);

module.exports = router;
