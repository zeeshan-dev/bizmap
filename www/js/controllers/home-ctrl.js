app.controller('HomeCtrl', ['$scope', '$location', '$cordovaGeolocation', '$state', '$localstorage',
  function($scope, $location, $cordovaGeolocation, $state, $localstorage) {

  var posOptions = {timeout: 30000, enableHighAccuracy: false};
  $scope.location = {lat : 0 ,lng : 0};
  $scope.error = 'None';

  var myObj = $scope;
   $cordovaGeolocation
   .getCurrentPosition(posOptions)
  
   .then(function (position) {
      var lat  = position.coords.latitude
      var long = position.coords.longitude
      console.log(lat + '   ' + long);
      alert("Success: location found");
      myObj.location.lat = lat;
      myObj.location.lng = long;
      $localstorage.setObject('location', {
        lat: lat,
        lng: long
      });

   }, function(err) {
      
      if ( err.code === 2 ) {
        alert('Please check your internet connection.');
      } else {
        alert('Please enable location service');
      }
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

  /*cordova.plugins.diagnostic.isWifiEnabled(function(enabled){
    console.log("WiFi is " + (enabled ? "enabled" : "disabled"));
  }, function(error){
      console.error("The following error occurred: "+error);
  });*/

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

  $scope.items = [
        {display: 'Accounting', value:'accounting'},
        {display: 'Airport', value:'airport'},
        {display: 'Atm', value:'atm'},
        {display: 'Bakery', value:'bakery'},
        {display: 'Bank', value:'bank'},
        {display: 'Beauty Salon', value:'beauty_salon'},
        {display: 'Book Store', value:'book_store'},
        {display: 'Business', value:'business'},
        {display: 'Business', value:'business'},
        {display: 'Doctor', value:'doctor'}
    ];
   $scope.onSelect = function(item) {
    console.log('The selected item is: '+JSON.stringify(item['value']));
    $state.go('list', {type:item['value']})
  };

  // fix for map loading issue in list screen
  $scope.$on( "$ionicView.enter", function( scopes, states ) {
    // remove list view on on home page 
    document.getElementById("listView").remove();
  });


}]);
// for slider left menu
// http://julienrenaux.fr/2014/05/09/ionic-framework-features-you-may-have-missed/