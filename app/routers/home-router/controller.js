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
            const password = request.body.password;
            return data.getRoomByName(request.body.name)
                .then((room) => {
                    if (password) {
                        //login as owner
                        if (password === room.password) {
                            // success
                            return response.json(room)
                        }
                        else {
                            return response.status(409).json('Wrong credentials!');
                        }
                    }
                    // login as guest
                    return response.json(room)
                });
        },

        createRoom(request, response) {
            const room = request.body;
            room.authKey = tokenGenerator.generate(32);
            room.questions = [];
            room.roomID = tokenGenerator.generate(8);
            room.currentQuestion = { text: '', answers: [] };
            return data.createRoom(room)
                .then((dbResponse) => {
                    if (dbResponse === null) {
                        return response.status(409).json('Already exists');
                    }
                    return response.status(201).json('Created!');
                });

        },

        addQuestion(request, response) {
            return data.addQuestionToRoom(request.body.roomID, request.body.question)
                .then(() => {
                    return response.status(201).json('Added question!');
                });
        },

        modifyQuestion(request, response) {
            return data.modifyQuestionInRoom(request.body.roomID, request.body.questionIndex, request.body.question)
                .then(() => {
                    return response.status(200).json('Added question!');
                });
        },

        removeQuestion(request, response) {
            return data.removeQuestion(request.params.roomID, request.params.questionIndex)
                .then(() => {
                    return response.status(200).json('Removed question!');
                })
        },

        updateCurrentQuestion(request, response) {
            return data.updateCurrentQuestion(request.body.roomID, request.body.questionIndex)
                .then(() => {
                    return response.status(200).json('Updated current question!');
                });
        }
    }
    return controller;
};


module.exports = { init };
