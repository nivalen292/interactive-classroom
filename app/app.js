/* globals __dirname */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

const init = (data) => {
    const db = data.db;

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(cors());

    // if (process.env.NODE_ENV === 'production') {
    //     // Serve any static files
    //     app.use(express.static(path.join(__dirname, 'interactive-classroom-client/build')));
    //     // Handle React routing, return all requests to React app
    //     app.get('*', function (req, res) {
    //         res.sendFile(path.join(__dirname, 'interactive-classroom-client/build', 'index.html'));
    //     });
    // }

    app.use('/', express.static('interactive-classroom-client/build'));

    require('./routers')
        .attachTo(app, db, data);

    // eslint-disable-next-line
    const server = require('http').Server(app);
    const io = require('socket.io')(server);

    // guest sockets by rooms
    let guestCount = {};

    io.sockets.on('connection', function (socket) {
        socket.on('disconnect', function (someData) {
        });
        socket.on('join', function (data) {
            socket.join(data.roomID);
            // count only guests not owners
            if (data.isGuest) {
                if (guestCount.hasOwnProperty(data.roomID)) {
                    guestCount[data.roomID]++;
                }
                else {
                    guestCount[data.roomID] = 1;
                }
            }
            io.to(data.roomID).emit('join', { guests: guestCount[data.roomID] /*io.of('/').in(data.roomID).clients.length*/ });
        });
        socket.on('leave', (dataObj) => {
            if (dataObj.isGuest) {
                guestCount[dataObj.roomID]--;
                socket.to(dataObj.roomID).emit('leave', { guests: guestCount[dataObj.roomID] });
            }
        });
        socket.on('change-question', (data) => {
            io.to(data.roomID).emit('change-question', data.questionIndex);
        });
        socket.on('show-results', (dataObj) => {
            data.getRoomByID(dataObj.roomID)
                .then((room) => {
                    const results = room.questions[dataObj.questionIndex].answers
                        .slice(0)
                        .map((a) => a.score);
                    io.to(dataObj.roomID).emit('show-results', { results: results, questionIndex: dataObj.questionIndex });
                });
        });
    });

    return Promise.resolve(server);
};

module.exports = { init };
