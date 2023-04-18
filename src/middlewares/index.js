const validateJoi = require('./validateJoi');
const validateId = require('./validateId');
const authMiddleware = require('./authMiddleware');
const validateUniqueName = require('./validateUniqueName');
const upload = require('./uploadAvatar');

module.exports = {
    validateJoi,
    validateId,
    authMiddleware,
    validateUniqueName,
    upload,
};
