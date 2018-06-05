const ENV = require('node-env-file')(__dirname + '/.env');
module.exports = function(app) {
    app.get('/ports.js', function(req, res) {
        let data = (`
            window.PORTS = ` + ENV.PORTS + `
        `)
        res.send(data);
    });

    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/resources/views/chat.html');
    });
};
