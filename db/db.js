const { MongoClient } = require('mongodb');

const init = (connectionString) => {
    return MongoClient.connect(connectionString, { useNewUrlParser: true });
};

module.exports = { init };