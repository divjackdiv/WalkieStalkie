var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: -34.397, lng: 150.644},
      zoom: 20,
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
    var infoWindow = new google.maps.InfoWindow({map: map});

    // Try HTML5 geolocation.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        infoWindow.setPosition(pos);
        infoWindow.setContent('Location found.');
        map.setCenter(pos);
      }, function() {
        handleLocationError(true, infoWindow, map.getCenter());
      });
    } else {
        handleLocationError(false, infoWindow, map.getCenter());
    }
    //var currentPosition = {lat: -34.397, lng: 150.644};
    var currentPosition = getPosition(infoWindow);
    var target = {lat: 90, lng: 120.644};
    //setInterval(getPosition(infoWindow), 1000);
    setInterval(function() {
	getPosition(infoWindow);
	//trace
        console.log("fuck");
    }, 1000);
    trace(currentPosition, target);
}
function getPosition(infoWindow) {
    navigator.geolocation.getCurrentPosition(function(position) {
	var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
	};

	infoWindow.setPosition(pos);
	infoWindow.setContent('Location found.');
	map.setCenter(pos);
	console.log("rrrr");
    }, function() {
	console.log("fucked it");
	handleLocationError(true, infoWindow, map.getCenter());
    });
}
function trace(currentPosition, targetPosition){
    nbOfPointers = 100; //getDistance(currentPosition, targetPosition);
    xDistance = (targetPosition.lat - currentPosition.lat)/nbOfPointers;
    yDistance = (targetPosition.lng - currentPosition.lng)/nbOfPointers;
    var flightPlanCoordinates = [];

    var angle = Math.atan2(targetPosition.lat - currentPosition.lat, targetPosition.lng - currentPosition.lng )*(180/Math.PI);
    var image = {
        url: "./traceIcon.png",
        scaledSize: new google.maps.Size(32, 30),
        anchor: new google.maps.Point(16, 15) ,
        rotation: 52
    };
    nbOfShownPointers = nbOfPointers/10;
    console.log(angle);
    for (var i = 0; i < nbOfShownPointers; i++){
        var p = {lat: currentPosition.lat + (xDistance *i), lng: currentPosition.lng + (yDistance *i)};
        var marker = new google.maps.Marker({
          position: p,
          map: map,
          icon: image
        });
    }
    var marker = new google.maps.Marker({
          position: currentPosition,
          map: map,
        });
    var marker = new google.maps.Marker({
          position: targetPosition,
          map: map,
        });
}
function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.' :
                          'Error: Your browser doesn\'t support geolocation.');
}
