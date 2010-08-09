var request = require('request')
  , sys = require('sys')
  ;

var id = "9e93e936ebe5872c59b48bb9f4000729"
  , db = "single_restart"
  ;

uri = "http://localhost:5984/"+ db +"/" + id;

var body = JSON.stringify({_id:'"'+id+'"', 
                           "data":"lasidjfkjsdhfiuashdfiuasdiufashdiufashd"})

request({uri:uri, method:'PUT', body:body}, function (err, resp, body) {
  if (err) throw err;
  sys.puts(sys.inspect(resp));
  sys.puts(body);
});
