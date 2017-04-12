const express    = require('express'),
      bodyParser = require('body-parser'),
      winston    = require('winston'),
      influx     = require('influx');

// Express configuration
let api = module.exports = express();

// Our database connection
let db = new influx.InfluxDB({
    host: process.env.INFLUX_HOST || "database",
    database: process.env.INFLUX_DATABASE || "temperature"
});

// Configure the body parsing routines
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));

// Just print the incoming data
api.post('/data', (req, res, next) => {
    winston.info(req.body);
    return res.sendStatus(201);
});
