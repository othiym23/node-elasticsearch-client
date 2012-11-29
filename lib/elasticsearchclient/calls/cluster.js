'use strict';

var querystring = require('querystring');
var ElasticSearchClient = require('../elasticSearchClient');

ElasticSearchClient.prototype.health = function(options) {
    var path = '/_cluster/health';
    var qs = '';

    if (options) qs = querystring.stringify(options);
    if (qs.length > 0) path += "?" + qs;

    return this.createCall({path: path, method: 'GET'}, this.clientOptions);
};

ElasticSearchClient.prototype.state = function(options) {
    var path = '/_cluster/state';
    var qs = '';

    if (options) qs = querystring.stringify(options);
    if (qs.length > 0) path += "?" + qs;

    return this.createCall({path: path, method: 'GET'}, this.clientOptions);
};


ElasticSearchClient.prototype.nodesInfo = function(nodes, options){
    var path = '/_cluster/nodes';
    var qs = '';

    if (nodes instanceof Array) path += '/' + nodes.join(',');
    if (options) qs = querystring.stringify(options);
    if (qs.length > 0) path += "?" + qs;

    return this.createCall({path: path, method: 'GET'}, this.clientOptions);
};

ElasticSearchClient.prototype.nodesStats = function(nodes, options) {
    var path = '/_cluster/nodes';
    var qs = '';

    if (nodes instanceof Array) path += '/' + nodes.join(',');
    path += '/stats';
    if (options) qs = querystring.stringify(options);
    if (qs.length > 0) path += "?" + qs;

    return this.createCall({path: path, method: 'GET'}, this.clientOptions);
};

ElasticSearchClient.prototype.nodesShutdown = function(nodes, options) {
    var path = '/_cluster/nodes';
    var qs = '';

    if (nodes instanceof Array) path += '/' + nodes.join(',');
    path+='/_shutdown';
    if (options) qs = querystring.stringify(options);
    if (qs.length > 0) path += "?" + qs;

    return this.createCall({path: path, method: 'POST'}, this.clientOptions);
};
