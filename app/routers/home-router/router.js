const attachTo = (app, db, data) => {
    const controller = require('./controller').init(db, data);

    app.get('/api/room/:id', controller.getRoomById);

    app.post('/api/room', controller.createRoom);
};

module.exports = { attachTo };