'use strict';

const request = require('request');

module.exports.json = function(query, cb) {
  
  if (typeof query != 'string') return cb(new TypeError('Expected a string as first argument.'), null);

  const base = 'https://www.googleapis.com/scribe/v1/research';
  const qs = {
    key: 'AIzaSyDqVYORLCUXxSv7zneerIgC2UYMnxvPeqQ',
    dataset: 'dictionary',
    dictionaryLanguage: 'en',
    callback: cb,
    query: query
  }

  request({url: base, qs: qs, json: true}, function(error, response, body) {
    return cb(error, body);
  });
}

module.exports.definitions = function(query, cb) {
  module.exports.json(query, function(error, response) {
    if (response['data'] == undefined) return cb(new Error('No results for given query.'), null);

    var definitions = [];
    response['data'][0]['dictionaryData']['definitionData'].forEach(function(obj, i) {
      definitions.push(obj.meanings[0].meaning)
    });

    cb(error, definitions);
  });
}
