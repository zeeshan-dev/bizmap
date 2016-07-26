app.controller('HomeCtrl', ['$scope', '$location', '$cordovaGeolocation', '$state', '$localstorage',
  function($scope, $location, $cordovaGeolocation, $state, $localstorage) {

  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $scope.location = {lat : 0 ,lng : 0};
  $scope.error = 'None';
  var myObj = $scope;
   $cordovaGeolocation
   .getCurrentPosition(posOptions)
  
   .then(function (position) {
      var lat  = position.coords.latitude
      var long = position.coords.longitude
      console.log('getCurrentPosition');
      console.log(lat + '   ' + long);

      myObj.location.lat = lat;
      myObj.location.lng = long;
      $localstorage.setObject('location', {
        lat: lat,
        lng: long
      });

   }, function(err) {
      console.log(err)
      alert('GCP: ' + err.message);
   });

  var watchOptions = {timeout : 3000, enableHighAccuracy: false};
  var watch = $cordovaGeolocation.watchPosition(watchOptions);
  
   watch.then(
      null,
    
      function(err) {
         console.log(err)
        alert('Watch: ' + err);
      },
    
      function(position) {
         var lat  = position.coords.latitude
         var long = position.coords.longitude
         console.log('watch');
         console.log(lat + '' + long)
         myObj.location.lat = lat;
         myObj.location.lng = long;
      }
   );

   watch.clearWatch();

   $scope.type = function(type) {
    var location = $localstorage.getObject('location');
    
    if ( Object.keys(location).length == 0 ) {
      alert('Please wait while we are getting your current location.');
      return;
    }
    $state.go('list', {type:type});
   }

 /* $scope.groups = [{
    name: "Restaurants",
    items: []
  },
  {
    name: "Businesses",
    items: []    

  },
  {
    name: "Hospitals",
    items: []
  },

  {
    name: "Banks"
    items: []
  }];*/
  var titleList = ["Food and Beverage", "Hospitals", "Banks"]
  $scope.groups = [];
  for (var i=0; i<3; i++) {
    $scope.groups[i] = {
      name: titleList[i],
      items: []
    };
    for (var j=0; j<1; j++) {
      $scope.groups[i].items.push(i + '-' + j);
    }
  }
  
  /*
   * if given group is the selected group, deselect it
   * else, select the given group
   */
  $scope.toggleGroup = function(group) {
    if ($scope.isGroupShown(group)) {
      $scope.shownGroup = null;
    } else {
      $scope.shownGroup = group;
    }
  };
  $scope.isGroupShown = function(group) {
    return $scope.shownGroup === group;
  };

}]);