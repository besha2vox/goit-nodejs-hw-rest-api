const { Contact } = require('../schemas');

// const validateUniq = async (next, contact, Contact) => {
//     const existingContact = await Contact.findOne({ name: contact.name });
//     if (existingContact) {
//         const err = new Error('Name must be unique');
//         err.status = 400;
//         return next(err);
//     }
//     next();
// };

const validateUniq = async (next, contact) => {
    console.log('Contact in validateUniq: ', Contact);
    const existingContact = await Contact.findOne({ name: contact.name });
    if (existingContact) {
        const err = new Error('Name must be unique');
        err.status = 400;
        return next(err);
    }
    next();
};

module.exports = validateUniq;
