const async = () => {
    return Promise.resolve();
};

//const { config } = require('./constants');

async()
    .then(() => require('./db').init(process.env.DB_URL || require('./constants').connectionString))
    .then((db) => require('./data').init(db))
    .then((data) => require('./app').init(data))
    .then((http) => {
        http.listen(process.env.PORT || require('./constants').port, '0.0.0.0', () => {
            console.log(`Server running at localhost:${config.port}`);
        });
    });