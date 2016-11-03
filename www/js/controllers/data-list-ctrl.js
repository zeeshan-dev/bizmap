app.controller('DataListCtrl', ['$scope', '$stateParams', '$state', '$localstorage', '$ionicModal','Loading', 'Utility',
	function($scope, $stateParams, $state, $localstorage, $ionicModal, Loading, Utility) {
	
	var GOOGLE_API_KEY = "AIzaSyBob4klgRSHqUhUS_zD0MBcuPhDfJmehOA";
	//var google = null;
	$scope.type = $stateParams.type;
  $scope.title = $scope.type.charAt(0).toUpperCase() + $scope.type.slice(1);
	$scope.location = $localstorage.getObject('location');
	$scope.lists = [];
  $scope.mapView =  true;
  $scope.distanceUnit = ' km';
	var myObj = $scope;
	var markerImage = 'img/marker.png'; 
  $scope.rating = {};
  $scope.rating.max = 5;
  $scope.rating.rate = 5;
  $scope.readOnly = true;
  //'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png';
 
	var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?callback=JSON_CALLBACK&location=24.8306316,67.1587208&radius=500&type=bank&key="+GOOGLE_API_KEY;
	//https://maps.googleapis.com/maps/api/place/details/json?callback=JSON_CALLBACK&placeid=ChIJjYuDJV86sz4Rfr74-5JJZ88&key=AIzaSyBob4klgRSHqUhUS_zD0MBcuPhDfJmehOA

  var map;
  var infowindow;
  var markerBounds;
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
  });

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
    console.log('status',status);
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
      position: place.geometry.location,
      icon: markerImage
    });
    
    // Extend markerBounds with each place marker.
    //markerBounds.extend(place.geometry.location);
    
    google.maps.event.addListener(marker, 'mousedown', function() {

      var html = getHtml(place);
      infowindow.setContent(html);
      //infowindow.setContent('<div><a href="#detail/'+place.place_id+'"><strong>' + place.name + '</strong></a><br>' +
           // place.vicinity + '</div>');
      infowindow.open(map, this);
    });
  }


  function getHtml(list){

   var html = '<div class="item" style="margin-bottom: -24px;padding:0px !important;">' +
      '<h1 class="positive"><a href="#detail/'+list.place_id+'" class="listLabel">'+list.name+'</a></h1>' +
      '<p class="rating-p"><rating ng-model="5" max="5" readonly="readOnly"></rating></p>' +
      '<p><strong>'+list.distance+$scope.distanceUnit+' | Food</strong></p>' +
      '<p class="addressBar">'+list.vicinity+'</p>' +
      '<div class="row" style="margin:0px!important;">' +
        '<div class="col">' +
          '<button class="button button-block button-positive listButtons" onclick='+"window.open('http://maps.google.com/maps?saddr="+$scope.location.lat+","+$scope.location.lng+"&daddr=24.8212163,67.0938748&doflg=ptm','_system','location=yes'); return false;"+'>' +
            '<i class="icon ion-arrow-graph-up-left" style="padding-right: 5px;"></i>DIRECTIONS</button>' +
        '</div>' +
        '<div class="col">' +
          '<a href="tel: 03222569865" class="button button-block button-positive listButtons" >' +
          '<i class="icon ion-ios-telephone" style="padding-right: 5px;"></i>CALL</a>' +
        '</div>' +
    '</div>' +
    '</div>';
    return html;
  }



  $scope.openUrl = function(url) {
    var url = "http://maps.google.com/maps?saddr="+$scope.location.lat+","+$scope.location.lng+"&daddr=24.8212163,67.0938748&doflg=ptm";
    window.open(url, '_system', 'location=yes'); 
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
    alert('Please check your internet connection.');
    // hide loading
    Loading.hide();
  }

  

    
}]);
