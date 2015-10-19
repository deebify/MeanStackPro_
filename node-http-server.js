var http = require('http'),fs = require('fs');

http.createServer(function(req,res){
    res.writeHead(200,{
        'Content-type':'application/json'
    });


    res.write(JSON.stringify({name:'yassine'}))

}).listen(8080);

