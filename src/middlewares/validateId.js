const mongoose = require('mongoose');
const { HttpError } = require('../helpers');

const validateId = (req, res, next) => {
    const { contactId } = req.params;
    if (!mongoose.isValidObjectId(contactId)) {
        next(HttpError(404));
    }
    next();
};

module.exports = validateId;
