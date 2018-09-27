const init = (db) => {
    const objectId = require('mongodb').ObjectID;
    const roomCollection = db.collection('interactive-classroom-rooms');

    const getRoomById = (id) => {
        return roomCollection
            .findOne({id: +id})
            .then((result) => Promise.resolve(result));
    }

    const data = {
        getRoomById,
    };

    return Promise.resolve(data);
};

module.exports = { init };
