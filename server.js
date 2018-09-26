const async = () => {
    return Promise.resolve();
};

const { config } = require('./constants');

async()
    .then(() => require('./db').init(config.connectionString))
    .then((db) => require('./data').init(db))
    .then((data) => require('./app').init(data))
    .then((http) => {
        http.listen(config.port, () => {
            console.log(`Server running at localhost:${config.port}`);
        });
    });