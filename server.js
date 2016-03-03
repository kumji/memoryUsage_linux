var express = require('express'),
  	app = express(),
  	fs = require('fs'),
  	path = require('path'),
  	exec = require('child_process').exec;

app.use(express.static(__dirname + '/'));

app.get('/', function(req,res){ 
    res.sendFile(path.join(__dirname+'/index.html'));
});

app.get('/checkMem', function(req,res){
		exec(path.join(__dirname+'/checkMem.sh'));
		fs.readFile(path.join(__dirname+'/mem_output.json'),function(err,data){
			res.send(data)
		});
});


var server = app.listen(3000, function() {
	var port = server.address().port;

	console.log("server is listening on port: %s", port);
});
