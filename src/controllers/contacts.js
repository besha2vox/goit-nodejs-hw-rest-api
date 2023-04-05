const { contactModels } = require('../db');
const { HttpError, ctrlWrapper } = require('../helpers');

const getAll = async (req, res, next) => {
    const result = await contactModels.listContacts();
    res.status(200).json({ result });
};

const getById = async (req, res, next) => {
    const { contactId } = req.params;

    const result = await contactModels.getContactById(contactId);

    if (!result) {
        next(HttpError(404));
        return;
    }
    res.status(200).json(result);
};

const add = async (req, res, next) => {
    const result = await contactModels.addContact(req.data);

    res.status(201).json(result);
};

const remove = async (req, res, next) => {
    const { contactId } = req.params;

    const result = await contactModels.removeContact(contactId);
    console.log(result);
    if (!result) {
        next(HttpError(404));
        return;
    }

    res.status(200).json({ message: 'contact deleted' });
};

const update = async (req, res, next) => {
    const { contactId } = req.params;

    const result = await contactModels.updateContact(contactId, req.data);

    if (!result) {
        next(HttpError(404));
        return;
    }

    res.status(200).json(result);
};

const updateStatus = async (req, res, next) => {
    const { contactId } = req.params;
    const { favorite } = req.body;

    if (!favorite) {
        next(HttpError(400, 'missing field favorite'));
        return;
    }

    const result = await contactModels.updateContactStatus(contactId, {
        favorite,
    });

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
    updateStatus: ctrlWrapper(updateStatus),
};
