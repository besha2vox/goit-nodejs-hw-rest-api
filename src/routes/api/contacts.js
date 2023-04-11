const express = require('express');
const { contactsCtrl } = require('../../controllers');
const {
    validateJoi,
    validateId,
    authMiddleware,
    validateUniqueName,
} = require('../../middlewares');
const { contactSchema } = require('../../schemas');

const { getAll, getById, add, remove, update, updateStatus } = contactsCtrl;

const router = express.Router();

router.get('/', authMiddleware, getAll);

router.get('/:contactId', authMiddleware, validateId, getById);

router.post(
    '/',
    authMiddleware,
    validateUniqueName,
    validateJoi(contactSchema.add),
    add
);

router.delete('/:contactId', authMiddleware, validateId, remove);

router.put(
    '/:contactId',
    authMiddleware,
    validateId,
    validateUniqueName,
    validateJoi(contactSchema.update),
    update
);

router.patch(
    '/:contactId/favorite',
    authMiddleware,
    validateId,
    validateJoi(contactSchema.updateStatus),
    updateStatus
);

module.exports = router;
