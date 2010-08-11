var request = require('request')
  , sys = require('sys')
  , fs = require('fs')
  , spawn = require('child_process').spawn
  ;

var db = 'multi_conflict_commit'
  , run = '/Users/mikeal/tmp/apache-couchdb-1.0.0/utils/run'
  , headers = {'content-type':'application/json'}
  , limit = 200
  , updates = []
  ;

var c;
  
function startCouch (cb) {
  var couch = spawn(run);
  var c = couch;
  var buffer = '';
  var l = function (chunk) {
    buffer += chunk.toString();
    sys.puts(chunk)
    var self = this;
    if (buffer.indexOf('Apache CouchDB has started on http://127.0.0.1:5984/') !== -1) {
      sys.puts('CouchDB started.')
      cb(couch)
      couch.stdout.removeListener('data', l);
    }
  }
  couch.stdout.on('data', l)
  // couch.stderr.on('data', function (chunk) {
  //   sys.error(chunk)
  // })
}
  
startCouch(function (couch) {
  request({uri:'http://localhost:5984/'+db, method:'PUT', headers:headers}, function (err, resp, body) {
    if (err) throw err;
    if (resp.statusCode !== 201) throw new Error(resp.statusCode+' '+body);
    sys.puts('Created DB.');
    request({uri:'http://localhost:5984/'+db, method:'POST', body:JSON.stringify({'data':'asdfasf'}), headers:headers}, 
      function (err, resp, body) {
        if (err) throw err;
        if (resp.statusCode !== 201) throw new Error(resp.statusCode+' '+body);
        sys.puts('Created Doc.')
        var id = JSON.parse(body).id;
        var rev = JSON.parse(body).rev;
        couch.on('exit', function () {
          sys.puts('CouchDB killed.')
          updaterTest(id, rev, 0);
        })
        setTimeout(function () {
          couch.kill();
        }, 2 * 1000)
        
    })
  }) 
})

function updaterTest (id, rev, count) {
  sys.puts('Count '+count)
  if (count === limit) {
    fs.writeFileSync('multi-conflict-commit-changes-log', updates.join('\n'));
    return
  }
  startCouch(function (couch) {
    request({uri:'http://localhost:5984/'+db, method:'POST', body:JSON.stringify({'data':'asdfasf'}), headers:headers}, function (err, resp, body) {
      if (err) throw err;
      if (resp.statusCode !== 201) throw new Error(resp.statusCode+' '+body);
      
      request({uri:'http://localhost:5984/'+db+'/_ensure_full_commit', method:'POST', headers:headers}, function (err, resp, body) {
        if (err) throw err;
        if (resp.statusCode !== 201) throw new Error(resp.statusCode+' '+body);
        var uri = 'http://localhost:5984/'+db+'/'+id
        request({uri:uri, method:'PUT', body:JSON.stringify({'data':'as'}), headers:headers}, function (err, resp, body) {
          if (err) throw err;
          if (resp.statusCode !== 409) throw new Error(resp.statusCode+' '+body);
          var body = JSON.stringify({_id:id, _rev:rev, count:count});
          setTimeout(function () {
            request({uri:uri, method:'PUT', body:body, headers:headers}, function (err, resp, body) {
              if (err) throw err;
              if (resp.statusCode !== 201) throw new Error(sys.inspect(resp));
              sys.puts('Updated '+body);
              updates.push(body);
              count += 1;
              couch.on('exit', function (){
                sys.puts('CouchDB killed.');
                updaterTest(id, rev, count);
              })
              setTimeout(function () {
                couch.kill();
              }, 2 * 1000)
            })
          }, 2 * 1000)
        });
      })
    })
  })
}

process.on('exit', function () {
  c.kill();
})