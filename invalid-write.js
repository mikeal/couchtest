var request = require('request')
  , sys = require('sys')
  ;

var id = "a48bfea7576dd1b6bf19924678001816"
  , db = "multi_conflict_with_attach"
  ;

uri = "http://localhost:5984/"+ db +"/" + id;

var body = JSON.stringify({_id:'"'+id+'"', 
                           "data":"lasidjfkjsdhfiuashdfiuasdiufashdiufashd"})

request({uri:uri, method:'PUT', body:body}, function (err, resp, body) {
  if (err) throw err;
  sys.puts(sys.inspect(resp));
  sys.puts(body);
});
