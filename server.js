var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
app.get('/map.html', function(req, res){
    res.sendFile(__dirname + '/map.html');
});


io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
	console.log('user disconnect');
    });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
