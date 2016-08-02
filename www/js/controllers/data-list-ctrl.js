app.controller('DataListCtrl', ['$scope', '$stateParams', '$localstorage', '$ionicModal','Loading', 'Utility',
	function($scope, $stateParams, $localstorage, $ionicModal, Loading, Utility) {
	
	var GOOGLE_API_KEY = "AIzaSyBob4klgRSHqUhUS_zD0MBcuPhDfJmehOA";
	//var google = null;
	$scope.type = $stateParams.type;
  $scope.title = $scope.type.charAt(0).toUpperCase() + $scope.type.slice(1);
	$scope.location = $localstorage.getObject('location');
	$scope.lists = [];
  $scope.mapView =  true;
  $scope.distanceUnit = ' km';
	var myObj = $scope;
	
	var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?callback=JSON_CALLBACK&location=24.8306316,67.1587208&radius=500&type=bank&key="+GOOGLE_API_KEY;
	//https://maps.googleapis.com/maps/api/place/details/json?callback=JSON_CALLBACK&placeid=ChIJjYuDJV86sz4Rfr74-5JJZ88&key=AIzaSyBob4klgRSHqUhUS_zD0MBcuPhDfJmehOA

  var map;
  var infowindow;
  var markerBounds;

  // show loading
  Loading.show();

  $scope.initMap = function() {
    var center = $scope.location;
    map = new google.maps.Map(document.getElementById('list-map'), {
      center: center,
      zoom: 15
    });
    
    //markerBounds = new google.maps.LatLngBounds();
    infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);
    service.nearbySearch({
      location: center,
      radius: 1000,
      //rankBy: google.maps.places.RankBy.DISTANCE,
      type: [myObj.type]
    }, callback);

  }

  function callback(results, status) {

    if (status === google.maps.places.PlacesServiceStatus.OK) {
    	
    	//myObj.$apply(function(){
          for (var i = 0; i < results.length; i++) {
            results[i].distance = Utility.calculateDistance(results[i], myObj.location);
            createMarker(results[i]);
          }
          
          // Finally we can call the Map.fitBounds() method to set the map to fit
          // our markerBounds
          //map.fitBounds(markerBounds);
          //map.setCenter(markerBounds.getCenter());
          
          // sort list by distance
    		  myObj.lists = Utility.sortListByDistance(results);
    	//});
    	
      
    }

    // hide loading
    Loading.hide();

  }

  function createMarker(place) {

    var placeLoc = place.geometry.location;
    var marker = new google.maps.Marker({
      map: map,
      position: place.geometry.location
    });
    
    // Extend markerBounds with each place marker.
    //markerBounds.extend(place.geometry.location);
    
    google.maps.event.addListener(marker, 'mousedown', function() {

      infowindow.setContent('<div><a href="#detail/'+place.place_id+'"><strong>' + place.name + '</strong></a><br>' +
            place.vicinity + '</div>');
      infowindow.open(map, this);
    });
  }

  /**
  * This function will show the window with google map,
  * having all business markers
  *
  **/
  $scope.showMap = function() {
    $scope.mapView = !$scope.mapView;
  }



  if (typeof google === 'object' && typeof google.maps === 'object') {
      $scope.initMap();
  } else {

    // hide loading
    Loading.hide();
  }

  

    
}]);
