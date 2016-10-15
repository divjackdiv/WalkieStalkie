var map;
var players = [];
var player = {markers: [], lat: -34.397, lng: 150.644};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
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
        scaledSize: new google.maps.Size(64, 141), // scaled size
        origin: new google.maps.Point(0,0), // origin
        anchor: new google.maps.Point(32, 128) // anchor
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

        faceMarker.setPosition(pos);
        map.setCenter(pos);
      }, function() {
        handleLocationError(true, faceMarker, map.getCenter());
      });
    } else {
        handleLocationError(false, faceMarker, map.getCenter());
    }

    initMarkers();
    setInterval(function() {
	   getPosition(faceMarker);
        console.log("fuck");
    }, 1000);

}

function getPosition(faceMarker) {
    navigator.geolocation.getCurrentPosition(function(position) {
	var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
	};
	faceMarker.setPosition(pos);
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
    var player1 = {markers: [], lat: -34.3972, lng: 150.645};
    var player2 = {markers: [], lat: -34.3972, lng: 150.642};
    var player3 = {markers: [], lat: -34.395, lng: 150.643};
    players.push(player1);
    players.push(player2);
    players.push(player3);
    for (var i = 0; i < players.length; i++){
        initTrace(player, players[i]);
    }
}
function initTrace(player, targetPlayer){
    nbOfPointers = 100; //getDistance(player, targetPlayer);
    xDistance = (targetPlayer.lat - player.lat)/nbOfPointers;
    yDistance = (targetPlayer.lng - player.lng)/nbOfPointers;
    var flightPlanCoordinates = [];
    var angle = Math.atan2(targetPlayer.lng - player.lng , targetPlayer.lat - player.lat)* (180 / Math.PI );
    var image = {
        path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
        rotation: angle
    };
    nbOfShownPointers = nbOfPointers/10;
    for (var i = 1; i < nbOfShownPointers; i++){
        var p = {lat: player.lat + (xDistance *i), lng: player.lng + (yDistance *i)};
        var marker = new google.maps.Marker({
          position: p,
          map: map,
          icon: image
        });
        targetPlayer.markers.push(marker);
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
