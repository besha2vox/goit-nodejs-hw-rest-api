const { HttpError, ctrlWrapper } = require('../helpers');
const { Contact } = require('../schemas');

const getAll = async (req, res, next) => {
    const { favorite, page, limit } = req.query;
    const { _id } = req.user;
    const all = await await Contact.find({ owner: _id });

    if (Boolean(favorite) && Boolean(page) && Boolean(limit)) {
        const skip = (page - 1) * limit;
        const filtered = await Contact.find({ owner: _id, favorite });
        const result = await Contact.find(
            { owner: _id, favorite },
            {},
            { skip, limit }
        );
        res.status(200).json({
            result: {
                contacts: result,
                hints: result.length,
                totalHints: filtered.length,
            },
        });
        return;
    }

    if (!favorite && Boolean(page) && Boolean(limit)) {
        const skip = (page - 1) * limit;
        const result = await Contact.find({ owner: _id }, {}, { skip, limit });
        res.status(200).json({
            result: {
                contacts: result,
                hints: result.length,
                totalHints: all.length,
            },
        });
        return;
    }

    if (Boolean(favorite) && !page && !limit) {
        const result = await Contact.find({ owner: _id, favorite });
        res.status(200).json({
            result: {
                contacts: result,
                totalHints: result.length,
            },
        });
        return;
    }

    res.status(200).json({
        result: { contacts: all, totalHints: all.length },
    });
};

const getById = async (req, res, next) => {
    const { contactId } = req.params;
    const { _id } = req.user;

    const result = await Contact.findOne({ _id: contactId, owner: _id });

    if (!result) {
        next(HttpError(404));
        return;
    }

    res.status(200).json(result);
};

const add = async (req, res, next) => {
    const { _id: owner } = req.user;
    const isExist = await Contact.findOne({ name: req.body.name, owner });

    if (isExist) {
        next(HttpError(400, `Contact with name ${req.body.name} is exists`));
        return;
    }

    const result = await Contact.create({ ...req.data, owner });

    res.status(201).json(result);
};

const remove = async (req, res, next) => {
    const { contactId } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOneAndDelete({ _id: contactId, owner });

    if (!result) {
        next(HttpError(404));
        return;
    }

    res.status(200).json({ message: 'contact deleted' });
};

const update = async (req, res, next) => {
    const { contactId } = req.params;
    const { _id: owner } = req.user;
    const result = await Contact.findOneAndUpdate(
        { _id: contactId, owner },
        req.data,
        {
            returnDocument: 'after',
        }
    );

    if (!result) {
        next(HttpError(404));
        return;
    }

    res.status(200).json(result);
};

const updateStatus = async (req, res, next) => {
    const { contactId } = req.params;
    const { favorite } = req.data;

    const { _id: owner } = req.user;
    const result = await Contact.findOneAndUpdate(
        { _id: contactId, owner },
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
