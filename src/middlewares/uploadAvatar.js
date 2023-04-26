const path = require('path');
const multer = require('multer');

const uploadDir = path.join(process.cwd(), 'tmp');

const storage = multer.diskStorage({
    destination: uploadDir,
    filename: async (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: storage,
});

module.exports = upload;
