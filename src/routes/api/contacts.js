const express = require('express');
const { contactsCtrl } = require('../../controllers');
const {
    validateJoi,
    validateId,
    authMiddleware,
    accessCheck,
    validateUniqueName,
} = require('../../middlewares');
const { contactSchema } = require('../../schemas');

const { getAll, getById, add, remove, update, updateStatus } = contactsCtrl;

const router = express.Router();

router.get('/', authMiddleware, getAll);

router.get('/:contactId', authMiddleware, accessCheck, validateId, getById);

router.post(
    '/',
    authMiddleware,
    // validateUniqueName,
    validateJoi(contactSchema.add),
    add
);

router.delete('/:contactId', authMiddleware, accessCheck, validateId, remove);

router.put(
    '/:contactId',
    authMiddleware,
    accessCheck,
    validateId,
    validateUniqueName,
    validateJoi(contactSchema.update),
    update
);

router.patch(
    '/:contactId/favorite',
    authMiddleware,
    accessCheck,
    validateId,
    validateJoi(contactSchema.updateStatus),
    updateStatus
);

module.exports = router;
