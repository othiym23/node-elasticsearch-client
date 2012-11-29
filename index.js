var path = require('path');

//imports libs
require('./lib/elasticsearchclient/calls/core');
require('./lib/elasticsearchclient/calls/indices');
require('./lib/elasticsearchclient/calls/cluster');
require('./lib/elasticsearchclient/calls/twitter');

module.exports = require('./lib/elasticsearchclient/elasticSearchClient');
