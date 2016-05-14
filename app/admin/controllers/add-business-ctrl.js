app.controller('AddBusinessCtrl', ['$scope' , '$state', 'Categories',
    function($scope, $state, Categories) {

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

  $scope.categories = Categories;
  $scope.selectedMain = function selectedMain(value){

    $scope.subcategories = JSON.parse($scope.selectedMainCategory);
    $scope.user.mainCategory = $scope.subcategories.name;    
  };
  //http://www.bruneiyellowpages.net/business_category_list.pdf

}]);