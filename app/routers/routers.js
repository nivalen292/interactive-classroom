/* globals __dirname */

const fs = require('fs');
const path = require('path');

const attachTo = (app, db, data) => {
    fs.readdirSync(__dirname)
        .filter((file) => file.includes('-router'))
        .forEach((file) => {
            const modulePath = path.join(__dirname, file);
            require(modulePath).attachTo(app, db, data);
        });
};

module.exports = { attachTo };
