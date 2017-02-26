const expect = require('chai').expect;

const request = require('supertest')(`http://localhost:${process.env.PORT || 3000}`);;

describe('server', function() {
  it('should return help text for the help command', function(done) {
    request
      .post('/api/anything')
      .send('text=help')
      .send('command=/lion-bot')
      .expect(function(res) {
        expect(res.body.text).to.have.string('help');
      })
      .end(done);
  });
});