const init = (db) => {
    const objectId = require('mongodb').ObjectID;
    const roomCollection = db.collection('interactive-classroom-rooms');

    const getRoomById = (id) => {
        return roomCollection
            .findOne({ roomID: id })
            .then((result) => Promise.resolve(result));
    }

    const createRoom = (room) => {
        return getRoomById(room.roomID)
            .then((result) => Promise.resolve(result == null))
            .then((canCreate) => {
                if (canCreate) {
                    return roomCollection
                        .insert(room);
                }
                return null;
            });
    }

    const data = {
        getRoomById,
        createRoom
    };

    return Promise.resolve(data);
};

module.exports = { init };
