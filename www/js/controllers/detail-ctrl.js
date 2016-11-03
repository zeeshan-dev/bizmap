app.controller('DetailCtrl', ['$scope', '$stateParams', '$localstorage','Loading', 'Utility','$window', '$ionicModal', '$ionicScrollDelegate', '$ionicSlideBoxDelegate',
	function($scope, $stateParams, $localstorage, Loading, Utility, window, $ionicModal, $ionicScrollDelegate, $ionicSlideBoxDelegate) {
	
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

  $scope.allImages = [{
    src: 'https://3.bp.blogspot.com/-c6gsexcQGmA/VswW0JUYjqI/AAAAAAAAAdg/O443KyCAGas/s600/741-Donald-Duck.jpg'
  }, {
    src: 'http://2.bp.blogspot.com/-cT1O387TmOI/UFYi7R_BU6I/AAAAAAAACI4/d8mm5bp_idE/s600/hd-game-wallpaper-final-fantasy-vii-hd-3d-final-fantasy-achtergrond.jpg'
  }, {
    src: 'http://1.bp.blogspot.com/-o-9bYAUUank/UZ_9PS-gj_I/AAAAAAAABsQ/XCQGECYyZhc/s600/Mickey_Mouse_11.png'
  }];
 
  $scope.zoomMin = 1;

$scope.showImages = function(index) {
  $scope.activeSlide = index;
  $scope.showModal('templates/gallery-zoomview.html');
};
 
$scope.showModal = function(templateUrl) {
  $ionicModal.fromTemplateUrl(templateUrl, {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
    $scope.modal.show();
  });
}
 
$scope.closeModal = function() {
  $scope.modal.hide();
  $scope.modal.remove()
};
 
  $scope.updateSlideStatus = function(slide) {
    var zoomFactor = $ionicScrollDelegate.$getByHandle('scrollHandle' + slide).getScrollPosition().zoom;
    if (zoomFactor == $scope.zoomMin) {
      $ionicSlideBoxDelegate.enableSlide(true);
    } else {
      $ionicSlideBoxDelegate.enableSlide(false);
    }
  };

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

  $scope.share = function(t, msg, img, link){  
    
    window.plugins.socialsharing.share('Hello from Bizmap', 'Bizmap', 'https://www.google.nl/images/srpr/logo4w.png', null)
  }

    
}]);
