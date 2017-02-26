const expect = require('chai').expect;
const app = require('../server/server.js');
const request = require('supertest')

describe('server', function() {
  it('should return help text for the help command', function(done) {
    request(app)
      .post('/api/anything')
      .send('text=help')
      .send('command=/lion-bot')
      .expect(function(res) {
        expect(res.body.text).to.have.string('help');
      })
      .end(done);
  });
});