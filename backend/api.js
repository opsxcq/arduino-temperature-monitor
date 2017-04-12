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

let info = winston.info;
let error = winston.error;

// Configure the body parsing routines
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: true }));

// Just print the incoming data
api.post('/data', (req, res, next) => {
    info(req.body);

    // Persist data
    db.writePoints([
        measurement: 'data',
        tags: { type: req.body.type },
        fields: { device: req.body.device, sensor: req.body.sensor, value: req.body.value },
        timestamp: new Date().getTime() * 1000000
    ]).then(() => {
        return res.sendStatus(201);
    }).catch( err => {
        error(err.message);
        return res.sendStatus(500);
    });
});
