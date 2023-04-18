const { Contact } = require('../schemas');
const { HttpError } = require('../helpers');

const validateUniqueName = async (req, res, next) => {
    const { contactId } = req.params;
    const existingContact = await Contact.findOne({ name: req.body.name });

    if (existingContact && existingContact._id.toString() === contactId) {
        return next(HttpError(400, 'Name must be unique'));
    }
    next();
};

module.exports = validateUniqueName;
