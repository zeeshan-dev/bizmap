app.service('Utility', [function() {

	/**
	 * Constructor, with class name
	 */
	function Utility () {
		
	}

	Utility.prototype.calculateDistance = function(data, currentLocation) {

		var rad = function(x) {
    		return x * Math.PI / 180;
  		};
  		
	    // Calculate the distance
	    var R = 6371000; // Meters
	    var dLat = rad( data.geometry.location.lat() - currentLocation.lat );
	    var dLong = rad( data.geometry.location.lng() - currentLocation.lng );
	    
	    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	    Math.cos(rad(currentLocation.lat)) * Math.cos(rad(data.geometry.location.lat())) *
	    Math.sin(dLong / 2) * Math.sin(dLong / 2);
	    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	    var d = R * c;

	    // for now we are assuming the distance in km
	    d = Math.round( (d / 1000) * 100) / 100;
	    return d; // returns the distance in meter
  	}



	Utility.prototype.sortListByDistance = function(list){
	    list.sort(function(a, b){
	    	a = parseFloat(a['distance']);
	       	b = parseFloat(b['distance']);
	       	return a - b;
	    });

	   return list;
  	}

	return new Utility();

}]);