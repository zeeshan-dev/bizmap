app.controller('DetailCtrl', ['$scope', '$stateParams', '$localstorage','Loading', 'Utility',
	function($scope, $stateParams, $localstorage, Loading, Utility) {
	
	$scope.place_id = $stateParams.id;
  var myObj = $scope;
  
  $scope.location = $localstorage.getObject('location');
  $scope.distanceUnit = ' km';
  $scope.distance = 0;

  // set the rate and max variables
  $scope.rating = {};
  $scope.rating.max = 5;
  $scope.readOnly = true;
  var markerImage = 'img/marker.png'; 

  // show loading
  Loading.show();

  $scope.initMap = function() {

    var map = new google.maps.Map(document.getElementById('detail-map'), {
      zoom: 15
    });

    var infowindow = new google.maps.InfoWindow();
    var service = new google.maps.places.PlacesService(map);

    service.getDetails({
      placeId: myObj.place_id
    }, function(place, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        var marker = new google.maps.Marker({
          map: map,
          position: place.geometry.location,
          icon: markerImage
        });
        google.maps.event.addListener(marker, 'mousedown', function() {
          infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
            place.formatted_address + '</div>');
          infowindow.open(map, this);
        });
        
        map.setCenter(new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()));
        myObj.distance = Utility.calculateDistance(place, myObj.location);
        myObj.place = place;
        myObj.rating.rate = (place.rating) ? place.rating : place.user_ratings_total;

      }
      // hide loading
      Loading.hide();
    });
  }

  if (typeof google === 'object' && typeof google.maps === 'object') {
    $scope.initMap();
  } else {
    // hide loading
    Loading.hide();
  }

    
}]);
