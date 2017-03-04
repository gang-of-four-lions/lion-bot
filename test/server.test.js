"use strict";
const expect = require('chai').expect;
const app = require('../server/server.js');
const request = require('supertest');

describe('server', function() {
  it('should return SPECIFIC ITEM on specific [id]', function(done) {
    request(app)
      .post('/api/anything')
      .send('text=3')
      .send('command=/lion-bot')
      .expect(function(res) {
        expect(res.body.attachments[0].footer).to.include('3');
      })
      .end(done);
  });

  it('should return HELP TEXT for the "help" command, with "ephemeral" response type', function(done) {
    request(app)
      .post('/api/anything')
      .send('text=help')
      .send('command=/lion-bot')
      .expect(function(res) {
        expect(res.body.attachments[0].text).to.have.string('/lion-bot'); // help text always contains command names
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
        expect(res.body.attachments[0].footer).to.include('No.');
        expect(res.body.response_type).to.equal('in_channel');
      })
      .end(done);
  });

  it('should return ITEM on NO "text" field, with "in_channel" response type', function(done) {
    request(app)
      .post('/api/anything')
      .send('command=/lion-bot')
      .expect(function(res) {
        expect(res.body.attachments[0].footer).to.include('No.');
        expect(res.body.response_type).to.equal('in_channel');
      })
      .end(done);
  });

  it('should return ITEM on incorrect "text" field, with "in_channel" response type', function(done) {
    request(app)
      .post('/api/anything')
      .send('text="some incorrect text"')
      .send('command=/lion-bot')
      .expect(function(res) {
        expect(res.body.attachments[0].footer).to.include('No.');
        expect(res.body.response_type).to.equal('in_channel');
      })
      .end(done);
  });

  it('should return an ITEM for the "filtered" command, with "in_channel" response type', function(done) {
    request(app)
      .post('/api/anything')
      .send('text=filtered')
      .send('command=/lion-bot')
      .expect(function(res) {
        expect(res.body.attachments[0].footer).to.include('No.');
        expect(res.body.response_type).to.equal('in_channel');
      })
      .end(done);
  });

  it('applyFilter() should not fucking pass any fucking fucks', function(done) {
    let applyFilter = require('../server/commands').applyFilter;
    let obj = {
      text: 'fuck filter this fucking cunt please'
    };
    expect(applyFilter(obj).text).to.not.have.string('fuck');
    done();
  });

  it('GET "/" should return the landing page', function(done) {
    request(app)
      .get('/')
      .expect(200)
      .end(done);
  });
});
