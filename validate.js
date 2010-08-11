var http = require('http')
  , request = require('request')
  , qs = require('querystring')
  , sys = require('sys')
  ;

var db = 'rv'
  , uri = 'http://nightcrawler.local:5984/'
  , headers = {'content-type':'application/json'}
  ;

request({uri:uri+db+'/_all_docs', headers:headers}, function (err, resp, body) {
  if (err) throw err;
  if (resp.statusCode !== 200) throw new Error(resp.statusCode+'\n'+body);
  var allids = {};
  JSON.parse(body).rows.forEach(function (row) {
    allids[row.id] = true;
  })
  request({uri:uri+'lost%2Bfound%2F'+db+'/_all_docs', headers:headers}, function (err, resp, body) {
    if (err) throw err;
    if (resp.statusCode !== 200) throw new Error(resp.statusCode+'\n'+body);
    JSON.parse(body).rows.forEach(function (row) {
      if (allids[row.id]) delete allids[row.id];
      else sys.puts('FOUND :: '+row.id) ;
    })
    var count = 0;
    for (i in allids) {
      count++;
      sys.puts('MISSING :: '+i);
    }
    sys.debug(count);
  })
})