'use strict';

var ElasticSearchClient = require('../elasticSearchClient');

ElasticSearchClient.prototype.health = function (options) {
  return this.query('/_cluster/health', options);
};

ElasticSearchClient.prototype.state = function (options) {
  return this.query('/_cluster/state', options);
};

ElasticSearchClient.prototype.nodesInfo = function (nodes, options){
  var path = '/_cluster/nodes';
  if (nodes instanceof Array) path += '/' + nodes.join(',');

  return this.query(path, options);
};

ElasticSearchClient.prototype.nodesStats = function (nodes, options) {
  var path = '/_cluster/nodes';
  if (nodes instanceof Array) path += '/' + nodes.join(',');
  path += '/stats';

  return this.query(path, options);
};

ElasticSearchClient.prototype.nodesShutdown = function (nodes, options) {
  var path = '/_cluster/nodes';
  if (nodes instanceof Array) path += '/' + nodes.join(',');
  path += '/_shutdown';

  return this.query(path, options, 'POST');
};
