'use strict';


const api     = require('./api'), // API 
      util    = require('util'), // Other dependencies
      winston = require('winston'),

// the base API port
let port   = process.env.PORT || 8080;


api.listen(port, function(){
    winston.info(util.format("Backend started on port %s", port));
});
