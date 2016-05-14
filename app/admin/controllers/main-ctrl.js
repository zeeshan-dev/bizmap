app.controller('MainCtrl', ['$scope' , '$state',
    function($scope, $state) {

 	$scope.addBusiness = function submit() {

 		console.log('Inside submit');
    $state.go('add-business');
 	};

}]);