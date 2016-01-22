'use strict';

const assert = require('assert');
const expect = require('chai').expect;

const defineJSON = require('./').json;
const define = require('./').definitions;

describe('word with multiple meanings', function() {
  this.timeout(5000);
  var definitions;
  beforeEach(function(done) {
    define('ok', function(err, data) {
      if (!err) definitions = data;
      done();
    });
  });
  it('should return the correct definitions', function() {
    let expect = definitions;
    let actual = ['used to express assent, agreement, or acceptance.', 
                  'satisfactory but not exceptionally or especially good.', 
                  'in a satisfactory manner or to a satisfactory extent.', 
                  'an authorization or approval.', 
                  'sanction or give approval to.', 
                  'Oklahoma (in official postal use).'];
    assert.deepEqual(expect, actual);
  });
});

describe('phrase with spaces', function() {
  this.timeout(5000);
  var definitions;
  beforeEach(function(done) {
    define('big data', function(err, data) {
      if (!err) definitions = data;
      done();
    });
  });
  it('should return the correct definition', function() {
    let expect = definitions[0]
    let actual = 'extremely large data sets that may be analyzed computationally to reveal patterns, trends, and associations, especially relating to human behavior and interactions.'
    assert.equal(expect, actual);
  });
});

describe('parameter of type int', function() {
  this.timeout(5000);
  it('should return a TypeError', function() {
    expect(function() {
      defineJSON(1, function(err, data){ throw err; });
    }).to.throw(TypeError, 'Expected a string as first argument.');
  });
});

describe('nonexistent word', function() {
  this.timeout(5000);
  it('should return a Error', function() {
    expect(function() {
      define('safisajfiasjfia', function(err, data){ if(error) throw err; });
    }).to.not.throw(/good function/);
  });
});
