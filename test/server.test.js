"use strict";
const expect = require('chai').expect;
const app = require('../server/server.js');
const request = require('supertest');

describe.skip('server', function() {
  it('should return HELP TEXT for the "help" command, with "ephemeral" response type', function(done) {
    request(app)
      .post('/api/anything')
      .send('text=help')
      .send('command=/lion-bot')
      .expect(function(res) {
        expect(res.body.text).to.have.string('/lion-bot'); // help text always contains command names
        expect(res.body.response_type).to.equal('ephemeral');
      })
      .end(done);
  });

  it('should return ITEM on empty "text" field, with "in_channel" response type', function(done) {
    request(app)
      .post('/api/anything')
      .send('text=""')
      .send('command=/lion-bot')
      .expect(function(res) {
        expect(res.body.text).to.not.equal("");
      // expect(res.body.response_type).to.equal('in_channel');
      })
      .end(done);
  });

  it('should return ITEM on incorrect "text" field, with "in_channel" response type', function(done) {
    request(app)
      .post('/api/anything')
      .send('text="some incorrect text"')
      .send('command=/lion-bot')
      .expect(function(res) {
        expect(res.body.text).to.not.equal("");
      // expect(res.body.response_type).to.equal('in_channel');
      })
      .end(done);
  });

  it('should return filtered text for the "filtered" command, with "in_channel" response type', function(done) {
    request(app)
      .post('/api/anything')
      .send('text=filtered')
      .send('command=/lion-bot')
      .expect(function(res) {
        expect(res.body.text).to.have.string('filtered');
        expect(res.body.response_type).to.equal('in_channel');
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