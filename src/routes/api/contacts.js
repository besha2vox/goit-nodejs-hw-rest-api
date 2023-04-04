const express = require('express');
const { contactsCtrl } = require('../../controllers');
const { validateContact, validateId } = require('../../middlewares');
const { contactSchemas } = require('../../service/schemas/index.js');

const { getAll, getById, add, remove, update, updateStatus } = contactsCtrl;

const router = express.Router();

router.get('/', getAll);

router.get('/:contactId', validateId, getById);

router.post('/', validateContact(contactSchemas.add), add);

router.delete('/:contactId', validateId, remove);

router.put(
    '/:contactId',
    validateId,
    validateContact(contactSchemas.update),
    update
);

router.patch('/:contactId/favorite', validateId, updateStatus);

module.exports = router;
