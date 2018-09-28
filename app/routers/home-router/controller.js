/* globals __dirname */
const fs = require('fs');
const tokenGenerator = require('rand-token');

const init = (db, data) => {

    const controller = {
        getRoomById(request, response) {
            return data.getRoomById(request.params.id)
                .then((room) => response.json(room));
        },

        createRoom(request, response) {
            const room = request.body;
            room.authKey = tokenGenerator.generate(32);
            room.questions = [];
            return data.createRoom(room)
                .then((dbResponse) => {
                    if (dbResponse === null) {
                        return response.status(409).json('Already exists');
                    }
                    return response.status(201).json('Created!');
                });

        }
    }
    return controller;
};


module.exports = { init };
