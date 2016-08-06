app.controller('MainCtrl', ['$scope', '$ionicSideMenuDelegate', 
	function($scope, $ionicSideMenuDelegate) {

  
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

  
}])