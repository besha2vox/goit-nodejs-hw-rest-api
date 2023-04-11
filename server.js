const app = require('./app');
const mongoose = require('mongoose');

// const PORT = process.env.PORT || 3000;
const { PORT = 3000, DB_HOST } = process.env;

mongoose.Promise = global.Promise;

mongoose
    .connect(DB_HOST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Database connection successful');

        app.listen(PORT, () => {
            console.log(`Server running. Use our API on port: ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error connecting to database:', error.message);
        process.exit(1);
    });
