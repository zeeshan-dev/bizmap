app.controller('AddBusinessCtrl', ['$scope', '$state', '$http', 'Categories', 'Api', 'API_SERVER_URL',
    function($scope, $state, $http, Categories, Api, API_SERVER_URL) {

  $scope.business = {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: ''
  };
  
  var me = $scope;

  $scope.states = ('Balochistan KPK Punjab Sindh Gilgit–Baltistan').split(' ').map(function(state) {
        return {abbrev: state};
  });
    
  $scope.categories = Categories;
  $scope.selectedMain = function selectedMain(value){

    $scope.subcategories = JSON.parse($scope.selectedMainCategory);
    $scope.business.mainCategory = $scope.subcategories.name;    
  };
  
  $scope.submit = function submit() {

    $scope.business.userId = 1;
    var formData = new FormData();

    angular.forEach($scope.businessLogo,function(obj){
        formData.append('logo', obj.lfFile);
    });

    angular.forEach($scope.business,function(value, key){
        formData.append(key, value);
    });

    var headers = {'Content-Type': undefined};
    var response = Api.post(API_SERVER_URL + '/business', formData, headers);

    response.then(function success(data){

      if (data.status === 'OK') {
        alert(data.message);  
      }

    }, function error(reason){

      if (data.status === 'FAIL') {
        alert(data.message);
      }
    });

  };

  $scope.reset = function reset() {
    $scope.business = {};
    $scope.businessLogo = null;
  };

  $scope.initGoogleLocation = function initGoogleLocation() {

    var places = new google.maps.places.Autocomplete(document.getElementById('address'));
    google.maps.event.addListener(places, 'place_changed', function () {
        var place = places.getPlace();
        var address = place.formatted_address;
        me.business.lat = place.geometry.location.lat();
        me.business.lng = place.geometry.location.lng();
    });
       
  }

}]);