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
var INDEX_NAME       = 'your_index_name'
  , OBJECT_TYPE_NAME = 'status'
  , RIVER_NAME       = 'ma_twitter_river'
  , BULKSIZE         = 50
  , CONFIG           = require('../etc/conf').test
  ;

test("twitter commands", function (t) {
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

        t.test("createOrModifyTwitterRiver command", function (t) {
          t.plan(1);
          // This is the river type, not the object type.
          var riverData = {
            type : "twitter",
            twitter : CONFIG.twitter,
            index : {
              index : INDEX_NAME,
              type : OBJECT_TYPE_NAME,
              bulk_size : BULKSIZE
            }
          };
          var riverer = client.createOrModifyTwitterRiver(RIVER_NAME, riverData);

          riverer.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.ok, "Twitter river created");
            t.end();
          });

          riverer.exec();
        });

        t.test("deleteTwitterRiver command", function (t) {
          t.plan(2);
          var deriverer = client.deleteTwitterRiver(RIVER_NAME);

          deriverer.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.ok, "succeeded");
            t.ok(returned.found, "river found (to be deleted)");
            t.end();
          });

          deriverer.exec();
        });

        t.end();
      });
    }
  });
});
