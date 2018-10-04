const attachTo = (app, db, data) => {
    const controller = require('./controller').init(db, data);

    app.get('/api/room/:roomID', controller.getRoomByID);

    app.put('/api/room', controller.getRoomByNameWhenJoining);

    app.post('/api/room', controller.createRoom);
    
    app.post('/api/room/:roomID/questions', controller.addQuestion);

    app.put('/api/room/:roomID/current-question', controller.updateCurrentQuestion);

    app.put('/api/room/:roomID/questions', controller.modifyQuestion);

    app.delete('/api/room/:roomID/questions/:questionIndex', controller.removeQuestion);
};

module.exports = { attachTo };