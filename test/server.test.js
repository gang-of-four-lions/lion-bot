const expect = require('chai').expect;
const app = require('../server/server.js');
const request = require('supertest')

describe('server', function() {
  it('should return help text for the help command, with ephemeral response type', function(done) {
    request(app)
      .post('/api/anything')
      .send('text=help')
      .send('command=/lion-bot')
      .expect(function(res) {
        expect(res.body.text).to.have.string('help');
        expect(res.body.response_type).to.equal('ephemeral');
      })
      .end(done);
  });

  it('GET "/" should return the landing page', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(done);
  });
});