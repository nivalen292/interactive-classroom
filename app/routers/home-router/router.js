const attachTo = (app, db, data) => {
    const controller = require('./controller').init(db, data);

    app.get('/api/room/:id', controller.getRoomById);
};

module.exports = { attachTo };