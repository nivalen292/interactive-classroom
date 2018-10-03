const attachTo = (app, db, data) => {
    const controller = require('./controller').init(db, data);

    app.get('/api/room/:roomID', controller.getRoomByID);

    app.put('/api/room', controller.getRoomByNameWhenJoining);

    app.put('/api/room/:roomID/questions', controller.addQuestion);

    app.post('/api/room', controller.createRoom);
};

module.exports = { attachTo };