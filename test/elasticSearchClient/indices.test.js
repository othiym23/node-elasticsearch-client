'use strict';

var assert = require('assert');
var ElasticSearchClient = require('../../index');

var serverOptions = {
  host: 'localhost',
  port: 9200
  //, secure: true,
  /*, auth: {
    username:'username',
    password:'password'
    }*/
};

var indexName = 'your_index_name';
var objName = 'your_object_name';

var elasticSearchClient = new ElasticSearchClient(serverOptions);

var tweet = {
  "tweet" : {
    "properties" : {
      "message" : {"type" : "string", "store" : "yes"}
    }
  }
};

var testAliases = function() {
  var aliases = {
    "actions": [
      { "add" : { "index" : "test1", "alias" : "alias1" } }
    ]
  };

  elasticSearchClient.createIndex(indexName, aliases)
    .on('data', function(data) {
      assert.ok(JSON.parse(data).ok, "testAliases failed");
    })
    .exec();
};

var testAnalyze = function() {
  elasticSearchClient.analyze(indexName,'this is a test')
    .on('data', function(data) {
      console.log(data);
      //assert.ok(JSON.parse(data).ok, "testAnalyze failed")
    })
    .exec();
};

var testCreateIndex = function() {
  elasticSearchClient.createIndex(indexName)
    .on('data', function(data) {
      console.log(data);
      //assert.ok(JSON.parse(data))
    })
    .exec();
};

var testDeleteIndex = function() {
  elasticSearchClient.deleteIndex(indexName)
    .on('data', function(data) {
      assert.ok(JSON.parse(data));
    })
    .exec();
};

var testOpenIndex = function() {
  elasticSearchClient.openIndex(indexName)
    .on('data', function(data) {
      assert.ok(JSON.parse(data).ok, 'testOpenIndex failed');
    })
    .exec();
};

var testCloseIndex = function() {
  elasticSearchClient.openIndex(indexName)
    .on('data', function(data) {
      assert.ok(JSON.parse(data).ok, 'testCloseIndex failed');
    })
    .exec();
};

var testGetSettings = function() {
  elasticSearchClient.getSettings(indexName)
    .on('data', function(data) {
      console.log(data);
      assert.ok(JSON.parse(data));
    })
    .exec();
};

var testUpdateSettings = function() {
  var settings = {
    "index" : {
      "number_of_replicas" : 4
   }
  };

  elasticSearchClient.updateSettings(indexName, settings)
    .on('data', function(data) {
      //assert.ok(JSON.parse(data), 'testSnapshot failed')
      assert.ok(JSON.parse(data).ok, 'testUpdateSettings failed');

    })
    .exec();
};

var testGetMapping = function() {
  elasticSearchClient.getMapping(indexName, objName)
    .on('data', function(data) {
      console.log(data);
      assert.ok(JSON.parse(data), 'testGetMapping failed');
    })
    .exec();
};

var testPutMapping = function() {
  elasticSearchClient.putMapping(indexName, objName, tweet)
    .on('data', function(data) {
      assert.ok(JSON.parse(data), 'testPutMapping failed');
    }).on('done', function(data) {})
    .exec();
};

var testDeleteMapping = function() {
  elasticSearchClient.deleteMapping(indexName, objName)
    .on('data', function(data) {
      assert.ok(JSON.parse(data), 'testDeleteMapping failed');
    })
    .exec();
};

var testRefresh = function() {
  elasticSearchClient.refresh(indexName)
    .on('data', function(data) {
      console.log(data);
      assert.ok(JSON.parse(data), 'testRefresh failed');
    })
    .exec();
};

var testOptimize = function() {
  elasticSearchClient.optimize(indexName)
    .on('data', function(data) {
      console.log(data);
      assert.ok(JSON.parse(data), 'testOptimize failed');
    })
    .exec();
};

var testFlush = function() {
  elasticSearchClient.flush(indexName)
    .on('data', function(data) {
      console.log(data);
      assert.ok(JSON.parse(data), 'testFlush failed');
    })
    .exec();
};

var testSnapShot = function() {
  elasticSearchClient.snapshot(indexName)
    .on('data', function(data) {
      //assert.ok(JSON.parse(data), 'testSnapshot failed')
      console.log(data);
    })
    .exec();
};


var testDefineTemplate = function() {
  var template = {
    "template" : "te*",
    "settings" : {
      "number_of_shards" : 1
    }
  };

  elasticSearchClient.defineTemplate('testTemplate', template)
    .on('data', function(data) {
      //assert.ok(JSON.parse(data), 'testDefineTemplate failed')
      console.log(data);
    })
    .exec();
};

var testGetTemplate = function() {
  elasticSearchClient.getTemplate('testTemplate')
    .on('data', function(data) {
      //assert.ok(JSON.parse(data), 'testGetTemplate failed')
      console.log(data);
    })
    .exec();
};

var testDeleteTemplate = function() {
  elasticSearchClient.deleteTemplate('testTemplate')
    .on('data', function(data) {
      //assert.ok(JSON.parse(data), 'testDeleteTemplate failed')
      console.log(data);
    })
    .exec();
};

var testStatus = function() {
  elasticSearchClient.status(indexName)
    .on('data', function(data) {
      //console.log(data)
      assert.ok(JSON.parse(data), 'testStatus failed');
    })
    .exec();
};

var testClearCache = function() {
  elasticSearchClient.clearCache(indexName)
    .on('data', function(data) {
      assert.ok(JSON.parse(data), 'testClearCache failed');
    })
    .exec();
};

testGetMapping();

testCreateIndex();
testPutMapping();
testDeleteMapping();
testRefresh();
testOptimize();
testFlush();
testSnapShot();
testUpdateSettings();
testStatus();
testClearCache();
testCloseIndex();
testOpenIndex();
testAnalyze();
testDeleteIndex();
