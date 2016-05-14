app.controller('AddBusinessCtrl', ['$scope', '$state', '$http', 'Categories',
    function($scope, $state, $http, Categories) {

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
    
  $scope.categories = Categories;
  $scope.selectedMain = function selectedMain(value){

    $scope.subcategories = JSON.parse($scope.selectedMainCategory);
    $scope.user.mainCategory = $scope.subcategories.name;    
  };
  //http://www.bruneiyellowpages.net/business_category_list.pdf

  $scope.submit = function submit() {

    var formData = new FormData();
    formData.append('logo', $scope.businessLogo);

    angular.forEach($scope.user,function(key, value){
        formData.append(key, value);
    });

    $http.post('./upload', formData, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
    }).then(function(result){
        // do sometingh                   
    },function(err){
        // do sometingh
    });
    
  };

}]);