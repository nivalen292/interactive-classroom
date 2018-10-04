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

    if (process.env.NODE_ENV === 'production') {
        // Serve any static files
        app.use(express.static(path.join(__dirname, 'interactive-classroom-client/build')));
        // Handle React routing, return all requests to React app
        app.get('*', function (req, res) {
            res.sendFile(path.join(__dirname, 'interactive-classroom-client/build', 'index.html'));
        });
    }

    app.use('/', express.static('interactive-classroom-client/build'));
    
    require('./routers')
        .attachTo(app, db, data);

    // eslint-disable-next-line
    const server = require('http').Server(app);
    const io = require('socket.io')(server);

    io.sockets.on('connection', function (socket) {
        socket.on('disconnect', function (someData) {
        });
        socket.on('change-question', (data) => {
            io.emit('change-question', data);
        })
    });

    return Promise.resolve(server);
};

module.exports = { init };
