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
var INDEX_NAME = 'your_index_name';

test("cluster commands", function (t) {
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

        t.test("health command", function (t) {
          t.plan(2);
          var health = client.health();

          health.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.number_of_nodes > 0, "at least one node is up");
            t.ok(returned.status, "cluster status is returned");
            t.end();
          });

          health.exec();
        });

        t.test("state command", function (t) {
          t.plan(7);
          var state = client.state({filter_nodes : true});

          state.on('data', function (data) {
            var returned = JSON.parse(data);
            t.notOk(returned.nodes, "node list is filtered");
            t.ok(returned.cluster_name, "includes a cluster name");
            t.ok(returned.blocks, "includes blocks");
            t.ok(returned.allocations, "includes allocation list");
            t.ok(returned.metadata, "includes metadata");
            t.ok(returned.routing_table, "includes a routing table");
            t.ok(returned.routing_nodes, "includes a list of routing nodes");
            t.end();
          });

          state.exec();
        });

        t.test("nodesInfo command", function (t) {
          t.plan(3);
          var info = client.nodesInfo([]);

          info.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.ok, "returns 'ok'");
            t.ok(returned.cluster_name, "returns a cluster name");
            t.ok(returned.nodes, "returns a list of nodes");
            t.end();
          });

          info.exec();
        });

        t.test("nodesStats command", function (t) {
          t.plan(2);
          var stats = client.nodesStats([]);

          stats.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.cluster_name, "returns a cluster name");
            t.ok(returned.nodes, "returns a list of nodes");
            t.end();
          });

          stats.exec();
        });

        t.test("nodesShutdown command", function (t) {
          t.plan(2);
          var shutdown = client.nodesShutdown([]);

          shutdown.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.cluster_name, "returns a cluster name");
            t.ok(returned.nodes, "returns a list of nodes to be shut down");
            t.end();
          });

          shutdown.exec();
        });

        t.end();
      });
    }
  });
});
