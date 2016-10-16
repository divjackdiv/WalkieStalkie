/* -----------------------
   Player class
   ------------------------*/

var Player = function (startLat, startLng) {
    var lat = startLat;
    var lng = startLng;
    var id;
    var hunted;

    var getLat = function() {
	return lat;
    }

    var getLng = function() {
	return lng;
    }

    var setLat = function(newLat) {
	lat = newLat;
    }

    var setLng = function(newLng) {
	lng = newLng;
    }

    return {
	getLat: getLat,
	getLng: getLng,
	setLat: setLat,
	setLng: setLng,
	id:id,
    hunted:hunted
    }
}

module.exports = Player
