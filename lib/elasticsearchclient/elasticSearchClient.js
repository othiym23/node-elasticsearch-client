'use strict';

var querystring       = require('querystring')
  , ElasticSearchCall = require('./calls/elasticSearchCall.js')
  ;

function ElasticSearchClient(options) {
  this.clientOptions = options || {};
}

ElasticSearchClient.prototype.createCall = function(params, options) {
  // If options.hosts round robin the hosts
  var nextHost;

  if (options.hosts) {
    nextHost = options.hosts.shift();
    options.hosts.push(nextHost);
  } else {
    nextHost = options;
  }

  return new ElasticSearchCall(params, nextHost);
};

ElasticSearchClient.prototype.query = function (path, options, method) {
  if (!method) method = 'GET';

  var qs = '';
  if (options) qs = querystring.stringify(options);
  if (qs.length > 0) path += "?" + qs;

  return this.createCall({path : path, method : method}, this.clientOptions);
};

var inetRE = /inet\[\/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\:(\d{1,5})\]/;

/**
 * Discover nodes of the elasticsearch cluster.
 * Call this function to automatically add all nodes of the
 * cluster in the hosts list.
 */
ElasticSearchClient.prototype.discoverNodes = function () {
  var self = this;
  var query = this.nodesInfo();
  var hosts = [];

  query.on('data', function (data) {
    var obj = JSON.parse(data);
    var nodes = obj.nodes;

    Object.keys(nodes).forEach(function (n) {
      var node = nodes[n];
      if (node.http_address) {
        var address = inetRE.exec(node.http_address);
        if (address) hosts.push({host : address[1], port : address[2]});
      }
    });

    if (hosts.length > 0) self.clientOptions.hosts = hosts;
  });

  query.exec();
};

module.exports = ElasticSearchClient;
