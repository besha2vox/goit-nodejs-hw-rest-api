const {
    listContacts,
    getContactById,
    addContact,
    updateContact,
    removeContact,
} = require('../models/contacts');
const { HttpError, ctrlWrapper } = require('../helpers');

const getAll = async (req, res, next) => {
    const result = await listContacts();
    res.status(200).json({ result });
};

const getById = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await getContactById(contactId);

    if (!result) {
        next(HttpError(404));
        return;
    }
    res.status(200).json(result);
};

const add = async (req, res, next) => {
    const result = await addContact(req.data);

    if (!result) {
        next(HttpError(400, 'contact with this phone number is exists'));
    }

    res.status(201).json(result);
};

const remove = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await removeContact(contactId);

    if (!result) {
        next(HttpError(404));
        return;
    }

    res.status(200).json({ message: 'contact deleted' });
};

const update = async (req, res, next) => {
    const { contactId } = req.params;
    const result = await updateContact(contactId, req.data);

    if (!result) {
        next(HttpError(404));
        return;
    }

    res.status(200).json(result);
};

module.exports = {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    remove: ctrlWrapper(remove),
    update: ctrlWrapper(update),
};
