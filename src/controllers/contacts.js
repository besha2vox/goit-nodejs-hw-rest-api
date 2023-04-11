const { HttpError, ctrlWrapper } = require('../helpers');
const { Contact } = require('../schemas');

const getAll = async (req, res, next) => {
    const { _id } = req.user;

    const result = await Contact.find({ owner: _id });
    console.log({ owner: _id }, result);
    res.status(200).json(result);
};

const getById = async (req, res, next) => {
    const { contactId } = req.params;
    const { _id } = req.user;

    const result = await Contact.findById(contactId);

    if (!result) {
        next(HttpError(404));
        return;
    }

    if (result.owner !== _id) {
        next(HttpError(403));
    }

    res.status(200).json(result);
};

const add = async (req, res, next) => {
    const { _id } = req.user;
    const result = await Contact.create({ ...req.data, owner: _id });

    res.status(201).json(result);
};

const remove = async (req, res, next) => {
    const { contactId } = req.params;

    const result = await Contact.findByIdAndDelete(contactId);

    if (!result) {
        next(HttpError(404));
        return;
    }

    res.status(200).json({ message: 'contact deleted' });
};

const update = async (req, res, next) => {
    const { contactId } = req.params;

    const result = await Contact.findByIdAndUpdate(contactId, req.data, {
        returnDocument: 'after',
    });

    if (!result) {
        next(HttpError(404));
        return;
    }

    res.status(200).json(result);
};

const updateStatus = async (req, res, next) => {
    const { contactId } = req.params;
    const { favorite } = req.data;

    const result = await Contact.findByIdAndUpdate(
        contactId,
        { favorite },
        { returnDocument: 'after' }
    );

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
