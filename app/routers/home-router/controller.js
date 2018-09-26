/* globals __dirname */
const fs = require('fs');

const init = (db, data) => {

    const controller = {
        getRoomById(request, response) {
            return data.getRoomById(request.params.id)
                .then((room) => Promise.resolve(room));
        }
    }
    return controller;
};


module.exports = { init };
