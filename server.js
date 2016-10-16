var express = require('express');
var app = express();
var http = require('http');
var server = require('http').Server(app);
var io = require('socket.io')(http);
var util = require('util');
var Player = require('./lib/Player');
var hunters = 0;
var victims = 0;


// Set port
var port = process.env.PORT || 3000;
app.set('port', port);

// Set static to /public
app.use(express.static(__dirname + '/public'));

/* -----------------------
   Game Variables
------------------------*/
var socket;
var players;
var currentId = 0;
/* -----------------------
   Game Initialisation
   ------------------------*/
server = app.listen(app.get('port'), function(err) {
    if (err){
	throw err;
    }
    console.log('Server started press Ctrl-C to terminate');
    init();
})

function init() {
    // Create empty array to store players
    players = [];
    // Attach socket.io to server
    socket = io.listen(server);

    // Start listening for events
    setEventHandlers();
}

/* -----------------------
   Game event handlers
   ------------------------*/

var setEventHandlers = function() {
    // Socket.IO
    socket.sockets.on('connection', onSocketConnection);
}


// New socket connection
function onSocketConnection(client) {
    util.log('New player connected: ' + client.id);
    // Listen for player disconnect
    client.on('disconnect', onClientDisconnect);
    // Listen for new player message
    client.on('new player', onNewPlayer);

    client.on('move player', onMovePlayer);

    client.on('get smoked', smokePlayers);
    // Listen for player position update
    client.on('update position', onPositionUpdate);
}

function smokePlayers(){
  this.broadcast.emit('get smoked');
}
// Socket disconnect
function onClientDisconnect () {
  util.log('Player has disconnected: ' + this.id);
  var removePlayer = playerById(this.id)
  // Remove player from players array
  players.splice(players.indexOf(removePlayer), 1)
  // Broadcast removed player to connected socket clients
  this.broadcast.emit('remove player', {id: this.id})
}

function onMovePlayer(data){
  var Player = playerById(this.id)
  Player.lat = data.lat;
  Player.lng = data.lng;
  this.broadcast.emit('move player', {id: Player.id, lat: data.lat, lng: data.lng, hunted: data.hunted});
}

// New player has joined
function onNewPlayer (data) {
  // Create a new player
  var newPlayer = new Player(data.lat, data.lng);
  newPlayer.id = this.id;
  // defining what kind of user
  if (hunters > victims) {
  	newPlayer.hunted = false;
  	victims++;
  } else {
  	newPlayer.hunted = true;
  	hunters++;
  }
   util.log('Hunter is ' + newPlayer.hunted);
  this.emit('set role', {hunted: newPlayer.hunted});
  // Broadcast new player to connected socket clients
  this.broadcast.emit('new player', {id: newPlayer.id, lat: newPlayer.getLat(), lng: newPlayer.getLng(), hunted: newPlayer.hunted});
  // Send existing players to the new player
  var i, existingPlayer;
  for (i = 0; i < players.length; i++) {
      existingPlayer = players[i]
      //TODO: Look at this v
      this.emit('new player', {id: existingPlayer.id, lat: existingPlayer.getLat(), lng: existingPlayer.getLng(), hunted: existingPlayer.hunted});
  }
  // Add new player to the players array
  players.push(newPlayer);
}

function onPositionUpdate (data) {
  // Find player in array
  var updatePlayer = playerById(this.id)

  // Player not found
  if (!updatePlayer) {
    util.log('Player not found: ' + this.id)
    return
  }

  // Update player position
  updatePlayer.setLat(data.lat)
  updatePlayer.setLng(data.lng)

  // Broadcast updated position to connected socket clients
  this.broadcast.emit('update position', {id: updatePlayer.id, x: updatePlayer.getLat(), y: updatePlayer.getLng()});
}


/* -----------------------
   Set up base directories
   ------------------------*/

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
app.get('/map.html', function(req, res){
    res.sendFile(__dirname + '/map.html');
});


/* -----------------------
   Helper Functions
   ------------------------*/

function playerById(id) {
    var i;
    for (i = 0; i < players.length; i++){
	if (players[i].id == id) {
	    return players[i];
	}
    }
    return false;
}
