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

test("core commands", function (t) {
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

        t.test("index command", function (t) {
          t.plan(1);
          var index = client.index(INDEX_NAME, OBJECT_NAME,
                                   {name : 'name', id : '1111'});

          index.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.ok, "succeeded");
            t.end();
          });

          index.exec();
        });

        t.test("get command", function (t) {
          t.plan(3);
          var get = client.get(INDEX_NAME, OBJECT_NAME, 1111);

          get.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.exists, "document exists");
            t.ok(returned._source, "has a source");
            t.equals(returned._id, '1111', "has an ID");
            t.end();
          });

          get.exec();
        });

        t.test("deleteDocument command", function (t) {
          t.plan(3);
          var deleteDocument = client.deleteDocument(INDEX_NAME, OBJECT_NAME,
                                                     1111);

          deleteDocument.on('data', function (data) {
            var returned = JSON.parse(data);
            t.equals(returned._id, '1111', "had an ID");
            t.ok(returned.found, "document found");
            t.ok(returned.ok, "succeeded");
            t.end();
          });

          deleteDocument.exec();
        });

        t.test("search command", function (t) {
          t.plan(2);
          var query = {query : {term : {name : "sushi"}}};
          var search = client.search(INDEX_NAME, OBJECT_NAME, query);

          search.on('data', function (data) {
            var returned = JSON.parse(data);
            t.notOk(returned.timed_out, "didn't time out");
            t.ok(returned.hits, "returned a collection of hits");
            t.end();
          });

          search.exec();
        });

        t.test("percolator command", function (t) {
          t.plan(1);
          var query = {query : {bool : {should : [{flt : {fields : ["name"], like_text : "a name"}}]}}};
          var search = client.percolator(INDEX_NAME, OBJECT_NAME, query);

          search.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.ok, "succeeded");
            t.end();
          });

          search.exec();
        });

        t.test("percolate command", function (t) {
          t.plan(2);
          var doc = {doc : {field1 : "value1"}};
          var search = client.percolate(INDEX_NAME, OBJECT_NAME, doc);

          search.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.ok, "succeeded");
            t.ok(returned.matches, "returned a collection of matches");
            t.end();
          });

          search.exec();
        });

        t.comment("bulk command not yet implemented");

        t.test("moreLikeThis command", function (t) {
          t.plan(1);
          var moreLikeThis = client.moreLikeThis(INDEX_NAME, OBJECT_NAME,
                                                 '4d714f52dd6a90842168b3d1');

          moreLikeThis.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.error, "document successfully not found");
            t.end();
          });

          moreLikeThis.exec();
        });

        t.test("deleteByQuery command", function (t) {
          t.plan(1);
          var query = {term : {name: 'name'}};
          var deleteByQuery = client.deleteByQuery(INDEX_NAME, OBJECT_NAME, query);

          deleteByQuery.on('data', function (data) {
            var returned = JSON.parse(data);
            t.ok(returned.ok, "succeeded");
            t.end();
          });

          deleteByQuery.exec();
        });

        t.test("count command", function (t) {
          t.plan(1);
          var query = 'name:unfound';
          var count = client.count(INDEX_NAME, OBJECT_NAME, query);

          count.on('data', function (data) {
            var returned = JSON.parse(data);
            t.equals(returned.count, 0, "succeeded");
            t.end();
          });

          count.exec();
        });

        t.end();
      });
    }
  });
});

/*
var testDeleteByQuery = function() {
  var qryObj = {
    term : {
      name: 'name'
    }
  };

  elasticSearchClient.deleteByQuery(INDEX_NAME, OBJECT_NAME, qryObj)
    .on('data', function(data) {
      assert.ok(JSON.parse(data), "testDeleteByQuery failed.");
    })
    .exec();
};

testMoreLikeThis();
testDeleteByQuery();
testMoreLikeThis();
testCount();
*/
