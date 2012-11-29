'use strict';

var assert = require('assert');
var ElasticSearchClient = require('../../index');
var serverOptions = {
  host: 'localhost',
  port: 9200
  //, secure: true
  /*, auth: {
    username:'username',
    password:'password'
    }*/
};

var elasticSearchClient = new ElasticSearchClient(serverOptions);

var testHealth = function() {
  elasticSearchClient.health()
    .on('data', function(data) {
      console.log(data);
      assert.ok(JSON.parse(data).ok, "testHealth failed");
    })
    .exec();
};

var testState = function() {
  elasticSearchClient.state({filter_nodes:true})
    .on('data', function(data) {
      console.log(data);
      assert.ok(JSON.parse(data).ok, "testState failed");
    })
    .exec();
};


var testNodesInfo = function() {
  elasticSearchClient.nodesInfo([])
    .on('data', function( data) {
      assert.ok(JSON.parse(data).ok, "testNodesInfo failed");
    })
    .exec();
};

var testNodeStats = function() {
  elasticSearchClient.nodesStats([])
    .on('data', function( data) {
      assert.ok(JSON.parse(data), "testNodeStats failed");
    })
    .exec();
};

var testNodesShutdown = function() {
  elasticSearchClient.nodesShutdown([])
    .on('data', function( data) {
      assert.ok(JSON.parse(data).ok, "testNodesShutdown failed");
    })
    .exec();
};

testHealth();
testState();
testNodesInfo();
testNodeStats();
