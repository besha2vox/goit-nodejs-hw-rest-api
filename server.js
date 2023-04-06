const app = require('./app');
const mongoose = require('mongoose');

// const PORT = process.env.PORT || 3000;
const { PORT = 3000, DB_HOST } = process.env;

mongoose.Promise = global.Promise;

mongoose.connect(DB_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.listen(PORT, () => {
    console.log(`Server running. Use our API on port: ${PORT}`);
});
