const { Contact } = require('../schemas');

const listContacts = () => Contact.find();

const getContactById = (contactId) => Contact.findById(contactId);

const removeContact = (contactId) => {
    console.log(contactId);
    return Contact.findByIdAndDelete(contactId);
};

const addContact = (body) => Contact.create(body);

const updateContact = (contactId, body) =>
    Contact.findByIdAndUpdate(contactId, body, { returnDocument: 'after' });

const updateContactStatus = (contactId, body) =>
    Contact.findByIdAndUpdate(contactId, body, { returnDocument: 'after' });

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    updateContactStatus,
};
