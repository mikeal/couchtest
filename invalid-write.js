var request = require('request')
  , sys = require('sys')
  ;

var id = "0bccb66bd165ef21ea6f30ea260001e8"
  , db = "testwritesdb"
  ;

uri = "http://localhost:5984/"+ db +"/" + id;

var body = JSON.stringify({_id:'"'+id+'"', 
                           "data":"lasidjfkjsdhfiuashdfiuasdiufashdiufashd"})

request({uri:uri, method:'PUT', body:body}, function (err, resp, body) {
  if (err) throw err;
  sys.puts(sys.inspect(resp));
  sys.puts(body);
});
