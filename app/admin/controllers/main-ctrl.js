app.controller('MainCtrl', ['$scope' , '$state',
    function($scope, $state) {

  $scope.addBusiness = function submit() {    
    $state.go('add-business');
  };

}]);