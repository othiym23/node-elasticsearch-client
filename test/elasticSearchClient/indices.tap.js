'use strict';

var spawn               = require('child_process').spawn
  , test                = require('tap').test
  , carrier             = require('carrier')
  , longjohn            = require('longjohn')
  , ElasticSearchClient = require('../../index')
  ;

/*
 * constants
 */
var INDEX_NAME = 'your_index_name'
  , OBJECT_NAME = 'your_object_name'
  ;

test("index commands", function (t) {
  // shutdown shuts down the nodes, so need to run the cluster ourselves
  var server = spawn('elasticsearch', ['-f'], {stdio : 'pipe'});
  server.on('close', function () {
    console.log('# elasticsearch server shut down');
  });

  this.tearDown(function () {
    server.kill();
  });

  carrier.carry(server.stdout, function (line) {
    if (line.match('started')) {
      process.nextTick(function () {
        var client = new ElasticSearchClient({
          host : 'localhost',
          port : 9200
        });

        t.test("proactive index cleanup", function (t) {
          t.plan(1);
          var gone = client.deleteIndex(INDEX_NAME);

          gone.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned);
            t.end();
          });

          gone.exec();
        });

        t.test("getMapping call", function (t) {
          t.plan(2);
          var getMapping = client.getMapping(INDEX_NAME, OBJECT_NAME);

          getMapping.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.error, "uh-oh (no, no, it's fine)");
            t.equals(returned.status, 404, "document not found");
            t.end();
          });

          getMapping.exec();
        });

        t.test("createIndex call", function (t) {
          t.plan(2);
          var createIndex = client.createIndex(INDEX_NAME);

          createIndex.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.ok, 'succeeded');
            t.ok(returned.acknowledged, 'acknowledged');
            t.end();
          });

          createIndex.exec();
        });

        t.test("clear out the index again", function (t) {
          t.plan(2);
          var gone = client.deleteIndex(INDEX_NAME);

          gone.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.ok, 'succeeded');
            t.ok(returned.acknowledged, 'acknowledged');
            t.end();
          });

          gone.exec();
        });

        t.test("createIndex with aliases", function (t) {
          t.plan(2);
          var aliases = {actions : [{add : {index : "test1", alias : "alias1"}}]};
          var createIndex = client.createIndex(INDEX_NAME, aliases);

          createIndex.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.ok, 'succeeded');
            t.ok(returned.acknowledged, 'acknowledged');
            t.end();
          });

          createIndex.exec();
        });

        t.test("putMapping command", function (t) {
          t.plan(2);
          var tweet = {tweet : {properties : {message : {type : "string", store : "yes"}}}};
          var putMapping = client.putMapping(INDEX_NAME, OBJECT_NAME, tweet);

          putMapping.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.ok, 'succeeded');
            t.ok(returned.acknowledged, 'acknowledged');
            t.end();
          });

          putMapping.exec();
        });

        t.test("deleteMapping command", function (t) {
          t.plan(1);
          var deleteMapping = client.deleteMapping(INDEX_NAME, OBJECT_NAME);

          deleteMapping.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.ok, 'succeeded');
            t.end();
          });

          deleteMapping.exec();
        });

        t.test("refresh command", function (t) {
          t.plan(1);
          var refresh = client.refresh(INDEX_NAME);

          refresh.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.ok, 'succeeded');
            t.end();
          });

          refresh.exec();
        });

        t.test("optimize command", function (t) {
          t.plan(1);
          var optimize = client.optimize(INDEX_NAME);

          optimize.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.ok, 'succeeded');
            t.end();
          });

          optimize.exec();
        });

        t.test("flush command", function (t) {
          t.plan(1);
          var flush = client.flush(INDEX_NAME);

          flush.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.ok, 'succeeded');
            t.end();
          });

          flush.exec();
        });

        t.test("snapshot command", function (t) {
          t.plan(1);
          var snapshot = client.snapshot(INDEX_NAME);

          snapshot.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.ok, 'succeeded');
            t.end();
          });

          snapshot.exec();
        });

        t.test("updateSettings command", function (t) {
          t.plan(1);
          var settings = {index : {number_of_replicas : 4}};

          var updateSettings = client.updateSettings(INDEX_NAME, settings);

          updateSettings.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.ok, 'succeeded');
            t.end();
          });

          updateSettings.exec();
        });

        t.test("getSettings command", function (t) {
          t.plan(1);
          var getSettings = client.getSettings(INDEX_NAME);

          getSettings.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned[INDEX_NAME].settings, 'settings returned');
            t.end();
          });

          getSettings.exec();
        });

        t.test("status command", function (t) {
          t.plan(2);
          var status = client.status(INDEX_NAME);

          status.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.ok, 'succeeded');
            t.ok(returned.indices, 'indices returned');
            t.end();
          });

          status.exec();
        });

        t.test("clearCache command", function (t) {
          t.plan(1);
          var clearCache = client.clearCache(INDEX_NAME);

          clearCache.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.ok, 'succeeded');
            t.end();
          });

          clearCache.exec();
        });

        t.test("closeIndex command", function (t) {
          t.plan(2);
          var closeIndex = client.closeIndex(INDEX_NAME);

          closeIndex.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.ok, 'succeeded');
            t.ok(returned.acknowledged, 'acknowledged');
            t.end();
          });

          closeIndex.exec();
        });

        t.test("openIndex command", function (t) {
          t.plan(2);
          var openIndex = client.openIndex(INDEX_NAME);

          openIndex.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.ok, 'succeeded');
            t.ok(returned.acknowledged, 'acknowledged');
            t.end();
          });

          openIndex.exec();
        });

        t.test("analyze command", function (t) {
          t.plan(1);
          var analyze = client.analyze(INDEX_NAME, 'this is a test');

          analyze.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.tokens, 'tokens returned');
            t.end();
          });

          analyze.exec();
        });

        t.test("defineTemplate command", function (t) {
          t.plan(2);
          var template = {template : "te*", settings : {"number_of_shards" : 1}};
          var defineTemplate = client.defineTemplate('test_template', template);

          defineTemplate.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.ok, 'succeeded');
            t.ok(returned.acknowledged, 'acknowledged');
            t.end();
          });

          defineTemplate.exec();
        });

        t.test("getTemplate command", function (t) {
          t.plan(1);
          var getTemplate = client.getTemplate('test_template');

          getTemplate.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.test_template, 'template fetched');
            t.end();
          });

          getTemplate.exec();
        });

        t.test("deleteTemplate command", function (t) {
          t.plan(2);
          var deleteTemplate = client.deleteTemplate('test_template');

          deleteTemplate.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.ok, 'succeeded');
            t.ok(returned.acknowledged, 'acknowledged');
            t.end();
          });

          deleteTemplate.exec();
        });

        t.test("deleteIndex command", function (t) {
          t.plan(2);
          var deleteIndex = client.deleteIndex(INDEX_NAME);

          deleteIndex.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.ok, 'succeeded');
            t.ok(returned.acknowledged, 'acknowledged');
            t.end();
          });

          deleteIndex.exec();
        });

        t.end();
      });
    }
  });
});
