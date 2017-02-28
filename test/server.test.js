"use strict";
const expect = require('chai').expect;
const app = require('../server/server.js');
const request = require('supertest');

describe('server', function() {
  it('should return help text for the "help" command, with "ephemeral" response type', function(done) {
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
  
   it('should return a text from DB at index, not null',function(done){
    request(app)
      .post('/api/anything')
      .send('text="0"')
      .send('command=/lion-bot')
      .expect(function(res){
           expect(res.body.text).to.not.equal("");
      })
      .end(done);
  });

  
  it('should return a random selection from DB, not null',function(done){
    request(app)
      .post('/api/anything')
      .send('text=""')
      .send('command=/lion-bot')
      .expect(function(res){
           expect(res.body.text).to.not.equal("");
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