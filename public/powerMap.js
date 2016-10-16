var map;
var players;
var player = {id : 0, markers: [], lat: 0, lng: 0};
var socket;

function setEventHandlers() {
    console.log("connection");
    socket.on("connect", onSocketConnected);
    socket.on("disconnect", onSocketDisconnect);
    socket.on("new player", onNewPlayer);
    socket.on("move player", onMovePlayer);
    socket.on("remove player", onRemovePlayer);
}
function onNewPlayer(p){
    var newPlayer = {id :p.id, markers: [], lat: p.lat, lng: p.lng, hunted: p.hunted};
    initTrace(player, newPlayer);
    players.push(newPlayer);
   // players = [];
}

function onSocketConnected() {
    console.log("Connected to socket server");
    socket.emit("new player", player);
};

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
};

function onMovePlayer(data) {
    for (var i = 0; i<players.length; i++){
        if(players[i].id == data.id){
            players[i] = {id :data.id, markers: [], lat: data.lat, lng: data.lng};
        }
    }
};

function onRemovePlayer(data) {
    console.log("REMOVING plyare");
    for (var i = 0; i<players.length; i++){
        if(players[i].id == data.id){
            players.splice(i, 1)
        }
    }   
};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.640},
      zoom: 19,
      scrollwheel: false,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false,
      draggable: false,
      keyboardShortcuts: false
    });
    var icon = {
        url: "img/face.png", // url
        scaledSize: new google.maps.Size(64, 64), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(32, 32) // anchor
    };

    var faceMarker = new google.maps.Marker({
        map: map,
        icon: icon
    });

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        player.lat = pos.lat;
        player.lng = pos.lng;
        console.log("player lat " + player.lat + " and lng " + player.lng);
        faceMarker.setPosition(pos);
        map.setCenter(pos);
      }, function() {
        handleLocationError(true, faceMarker, map.getCenter());
      });
    } else {
        handleLocationError(false, faceMarker, map.getCenter());
    }
    players = [];
    initMarkers();
    setInterval(function() {
	   getPosition(faceMarker);
       updateTrace();
       socket.emit("move player", player);
    }, 1000);
    socket = io.connect();
    setEventHandlers();
}

function getPosition(faceMarker) {
    navigator.geolocation.getCurrentPosition(function(position) {
	var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
	};
	faceMarker.setPosition(pos);
    player.lat = pos.lat;
    player.lng = pos.lng;
	map.setCenter(pos);
    }, function() {
	   handleLocationError(true, faceMarker, map.getCenter());
    });
}
function smokeBomb(){
    document.getElementById('myCanvas').style.display = "block";
    /*for (var i = 0; i < players[playerIndex].markers.length ; i++){
        players[playerIndex].markers[i].setMap(null);
    }
    setTimeout(function() { makeVisibleAgain(playerIndex); }, 5000);*/
    setTimeout(function() { makeVisibleAgain(); }, 5000);
}

function makeVisibleAgain(){
    document.getElementById('myCanvas').style.display = "none";
    /*for (var i = 0; i < players[playerIndex].markers.length ; i++){
        players[playerIndex].markers[i].setMap(map);
    }*/
}

function initMarkers(){
    for (var i = 0; i < players.length; i++){
        initTrace(player, players[i]);
    }
}
function initTrace(player, targetPlayer){
    console.log("init trace " + targetPlayer.lat + " and lng " + targetPlayer.lng);
    nbOfPointers = 100; //getDistance(player, targetPlayer);
    xDistance = (targetPlayer.lat - player.lat)/nbOfPointers;
    yDistance = (targetPlayer.lng - player.lng)/nbOfPointers;
    var flightPlanCoordinates = [];
    var angle = Math.atan2(targetPlayer.lng - player.lng , targetPlayer.lat - player.lat)* (180 / Math.PI );
    var image = {
        path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
        rotation: angle,
        scale : 4
    };
    nbOfShownPointers = nbOfPointers/10;
    for (var i = 0; i < nbOfShownPointers; i++){
        console.log("       i " + i);
        var p = {lat: player.lat + (xDistance *i), lng: player.lng + (yDistance *i)};
        var marker = new google.maps.Marker({
          position: p,
          map: map,
          icon: image
        });
        targetPlayer.markers.push(marker);
    }
}
function updateTrace(){
    //console.log("plyars " + players.length);
    for (var j = 0; j < players.length; j++){
        //console.log("       seee " + players[j].id + " lat " +players[j].lat + " and " + players[j].lng);
        for (var i = 0; i < players[j].markers.length; i++){
            //console.log("           fefe");
            nbOfPointers = 100; 
            xDistance = (players[j].lat - player.lat)/nbOfPointers;
            yDistance = (players[j].lng - player.lng)/nbOfPointers;
            var angle = Math.atan2(players[j].lng - player.lng , players[j].lat - player.lat)* (180 / Math.PI );
            var image = {
                path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
                rotation: angle,
                scale : 4
            };
            var p = {lat: player.lat + (xDistance *i), lng: player.lng + (yDistance * i)};
            //console.log(p.lat+ " and " + p.lng + " but plyare " + player.lat + " and " + player.lng);
            var latlng = new google.maps.LatLng(p.lat, p.lng);
            players[j].markers[i].setPosition(latlng);
            players[j].markers[i].set("icon", image);
        }
    }
}

function handleLocationError(browserHasGeolocation, faceMarker, pos) {
    faceMarker.setPosition(pos);
    console.log(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
}

// Create an array to store our particles
var particles = [];

// The amount of particles to render
var particleCount = 30;

// The maximum velocity in each direction
var maxVelocity = 2;

// The target frames per second (how often do we want to update / redraw the scene)
var targetFPS = 33;

// Set the dimensions of the canvas as variables so they can be used.
var canvasWidth = 400;
var canvasHeight = 400;

// Create an image object (only need one instance)
var imageObj = new Image();

// Once the image has been downloaded then set the image on all of the particles
imageObj.onload = function() {
    particles.forEach(function(particle) {
            particle.setImage(imageObj);
    });
};

// Once the callback is arranged then set the source of the image
imageObj.src = "http://www.blog.jonnycornwell.com/wp-content/uploads/2012/07/Smoke10.png";

// A function to create a particle object.
function Particle(context) {

    // Set the initial x and y positions
    this.x = 0;
    this.y = 0;

    // Set the initial velocity
    this.xVelocity = 0;
    this.yVelocity = 0;

    // Set the radius
    this.radius = 5;

    // Store the context which will be used to draw the particle
    this.context = context;

    // The function to draw the particle on the canvas.
    this.draw = function() {

        // If an image is set draw it
        if(this.image){
            this.context.drawImage(this.image, this.x-128, this.y-128);
            // If the image is being rendered do not draw the circle so break out of the draw function
            return;
        }
        // Draw the circle as before, with the addition of using the position and the radius from this object.
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        this.context.fillStyle = "rgba(0, 255, 255, 1)";
        this.context.fill();
        this.context.closePath();
    };

    // Update the particle.
    this.update = function() {
        // Update the position of the particle with the addition of the velocity.
        this.x += this.xVelocity;
        this.y += this.yVelocity;

        // Check if has crossed the right edge
        if (this.x >= canvasWidth) {
            this.xVelocity = -this.xVelocity;
            this.x = canvasWidth;
        }
        // Check if has crossed the left edge
        else if (this.x <= 0) {
            this.xVelocity = -this.xVelocity;
            this.x = 0;
        }

        // Check if has crossed the bottom edge
        if (this.y >= canvasHeight) {
            this.yVelocity = -this.yVelocity;
            this.y = canvasHeight;
        }

        // Check if has crossed the top edge
        else if (this.y <= 0) {
            this.yVelocity = -this.yVelocity;
            this.y = 0;
        }
    };

    // A function to set the position of the particle.
    this.setPosition = function(x, y) {
        this.x = x;
        this.y = y;
    };

    // Function to set the velocity.
    this.setVelocity = function(x, y) {
        this.xVelocity = x;
        this.yVelocity = y;
    };

    this.setImage = function(image){
        this.image = image;
    }
}

// A function to generate a random number between 2 values
function generateRandom(min, max){
    return Math.random() * (max - min) + min;
}

// The canvas context if it is defined.
var context;

// Initialise the scene and set the context if possible
function init() {
    var canvas = document.getElementById('myCanvas');
    if (canvas.getContext) {

        // Set the context variable so it can be re-used
        context = canvas.getContext('2d');

        // Create the particles and set their initial positions and velocities
        for(var i=0; i < particleCount; ++i){
            var particle = new Particle(context);

            // Set the position to be inside the canvas bounds
            particle.setPosition(generateRandom(0, canvasWidth), generateRandom(0, canvasHeight));

            // Set the initial velocity to be either random and either negative or positive
            particle.setVelocity(generateRandom(-maxVelocity, maxVelocity), generateRandom(-maxVelocity, maxVelocity));
            particles.push(particle);
        }
    }
    else {
        alert("Please use a modern browser");
    }
}

// The function to draw the scene
function draw() {

    // Go through all of the particles and draw them.
    particles.forEach(function(particle) {
        particle.draw();
    });
}

// Update the scene
function update() {
    particles.forEach(function(particle) {
        particle.update();
    });
}

// Initialize the scene
init();

// If the context is set then we can draw the scene (if not then the browser does not support canvas)
if (context) {
    setInterval(function() {
        // Update the scene befoe drawing
        update();

        // Draw the scene
        draw();
    }, 1000 / targetFPS);
}

