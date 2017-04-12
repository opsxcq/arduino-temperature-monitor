const request = require('supertest'),
      api     = require('../api');
      winston = require('winston'),
      util    = require('util'),
      port    = 8080,
      baseURL = util.format('http://localhost:%s', port);

before(function(){
    api.listen(port, function(){
        winston.info(util.format("Backend started on port %s", port));
    });
});

describe('Receive data', function(){
    it('should accept data from clients', function(done){
        request(baseURL)
        .post('/data')
        .set('Content-Type', 'application/json')
        .send({"type": "temperature", "value": 21, "device": 1, "sensor": 1 })
        .expect(201)
        .end(function(err, res){
            if (err) throw err;
            done();
        })
    });
});
