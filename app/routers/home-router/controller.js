/* globals __dirname */
const fs = require('fs');
const tokenGenerator = require('rand-token');

const init = (db, data) => {

    const controller = {
        getRoomByID(request, response) {
            return data.getRoomByID(request.params.roomID)
                .then((room) => response.json(room));
        },

        getRoomByNameWhenJoining(request, response) {
            return data.getRoomByName(request.body.name)
                .then((room) => response.json(room));
        },

        createRoom(request, response) {
            const room = request.body;
            room.authKey = tokenGenerator.generate(32);
            room.questions = [];
            room.roomID = tokenGenerator.generate(8);
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
