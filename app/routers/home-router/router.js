const attachTo = (app, db, data) => {
    const controller = require('./controller').init(db, data);

    app.get('/api/test', (request, response) => {
        return response.json({data: "some data"});
    });
};

module.exports = { attachTo };