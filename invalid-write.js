var request = require('request')
  , sys = require('sys');

var id = "50b43230770fec2b1a3ea794f20007fc"
var db = "multiple_restart"

uri = "http://localhost:5984/"+ db +"/" + id;

var body = JSON.stringify({_id:'"'+id+'"', 
                           "data":"lasidjfkjsdhfiuashdfiuasdiufashdiufashd"})

request({uri:uri, method:'PUT', body:body}, function (err, resp, body) {
  if (err) throw err;
  sys.puts(sys.inspect(resp));
  sys.puts(body);
});
