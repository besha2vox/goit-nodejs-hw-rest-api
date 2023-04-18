const bcrypt = require('bcrypt');

const hashingPassword = async (data) => {
    if (data.isNew) {
        data.password = await bcrypt.hash(data.password, 10);
    }
};

module.exports = hashingPassword;
