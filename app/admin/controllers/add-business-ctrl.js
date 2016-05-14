app.controller('AddBusinessCtrl', ['$scope' , '$state',
    function($scope, $state) {

  $scope.user = {
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: ''
    };
    $scope.states = ('Balochistan KPK Punjab Sindh Gilgit–Baltistan').split(' ').map(function(state) {
        return {abbrev: state};
      });
    
 	$scope.submit = function submit() {

 		console.log('Inside submit');
 	};

}]);