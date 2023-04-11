const { Contact } = require('../schemas');
const { HttpError, ctrlWrapper } = require('../helpers');

const accessCheck = async (req, res, next) => {
    const { contactId } = req.params;
    const { _id } = req.user;

    const contact = await Contact.findById(contactId);

    if (!contact) {
        next(HttpError(404));
    }

    // if (contact.owner !== _id) {
    //     next(HttpError(403));
    // }

    next();
};

module.exports = {
    accessCheck: ctrlWrapper(accessCheck),
};
