const express    = require('express'),
      bodyParser = require('body-parser'),
      winston    = require('winston');

// Express configuration
let api = module.exports = express();

// Configure the body parsing routines
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));

// Just print the incoming data
api.post('/data', (req, res, next) => {
    winston.info(req.body);
    return res.sendStatus(201);
});
