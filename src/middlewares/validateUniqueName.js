const { Contact } = require('../schemas');

const validateUniqueName = async (req, res, next) => {
    console.log('Contact in validateUniq: ', Contact);
    const existingContact = await Contact.findOne({ name: req.body.name });
    if (existingContact) {
        const err = new Error('Name must be unique');
        err.status = 400;
        return next(err);
    }
    next();
};

module.exports = validateUniqueName;
