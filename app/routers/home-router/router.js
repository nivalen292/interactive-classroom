const attachTo = (app, db, data) => {
    const controller = require('./controller').init(db, data);

    app.get('/api/room/:roomID', controller.getRoomByID);

    app.post('/api/room', controller.createRoom);
};

module.exports = { attachTo };