const init = (db) => {
    const objectId = require('mongodb').ObjectID;
    const roomCollection = db.collection('interactive-classroom-rooms');

    const getRoomByID = (id) => {
        return roomCollection
            .findOne({ roomID: id })
            .then((result) => Promise.resolve(result));
    }

    const getRoomByName = (name) => {
        return roomCollection
            .findOne({ name: name })
            .then((result) => Promise.resolve(result));
    }

    const createRoom = (room) => {
        return getRoomByName(room.name)
            .then((result) => Promise.resolve(result === null))
            .then((canCreate) => {
                if (canCreate) {
                    return roomCollection
                        .insert(room);
                }
                return null;
            });
    }

    const addQuestionToRoom = (roomID, question) => {
        return roomCollection
            .update(
                { roomID: roomID },
                { $push: { questions: question } }
            )
            .then(() => Promise.resolve());
    }

    const modifyQuestionInRoom = (roomID, questionIndex, question) => {
        return roomCollection
            .findOne({ roomID: roomID })
            .then((room) => {
                room.questions[questionIndex] = question;
                return roomCollection
                    .replaceOne({ roomID: roomID }, room)
                    .then(() => Promise.resolve());
            });
    }

    const removeQuestion = (roomID, questionIndex) => {
        return roomCollection
            .findOne({ roomID: roomID })
            .then((room) => {
                room.questions.splice(questionIndex, 1);
                return roomCollection
                    .replaceOne({ roomID: roomID }, room)
                    .then(() => Promise.resolve());
            });
    }

    const updateCurrentQuestion = (roomID, questionIndex) => {
        return roomCollection
            .findOne({ roomID: roomID })
            .then((room) => {
                try {
                    room.currentQuestion = room.questions[questionIndex];
                }
                catch (e) {
                    room.currentQuestion = null;
                }
                return roomCollection
                    .replaceOne({ roomID: roomID }, room)
                    .then(() => Promise.resolve());
            });
    }

    const receiveAnswer = (roomID, answerIndex) => {
        return roomCollection
            .findOne({ roomID: roomID })
            .then((room) => {
                // check for error if index is -1
                const currentQuestionIndex = room.questions.findIndex((q) => q.text === room.currentQuestion.text);
                room.questions[currentQuestionIndex].answers[answerIndex].score++;
                return roomCollection
                    .replaceOne({ roomID: roomID }, room)
                    .then(() => Promise.resolve());
            });
    }

    const data = {
        getRoomByID,
        createRoom,
        getRoomByName,
        addQuestionToRoom,
        modifyQuestionInRoom,
        removeQuestion,
        updateCurrentQuestion,
        receiveAnswer
    };

    return Promise.resolve(data);
};

module.exports = { init };
