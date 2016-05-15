app.controller('AddBusinessCtrl', ['$scope', '$state', '$http', 'Categories', 'Api', 'API_SERVER_URL',
    function($scope, $state, $http, Categories, Api, API_SERVER_URL) {

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

    $scope.user = {
      userId:'1',
      name:'KFC',
      mainCategory:'FOOD',
      subCategory:'Delivery',
      phone:'111-111-1265',
      email:'info@kfc.com',
      website:'www.kfc.com',
      contactPerson:'Rashid Khan',
      address:'Clifton, Karachi',
      city:'Karachi',
      state:'Sindh',
      postalCode:'75400',
      description:'This is food company'
    };

    var formData = new FormData();

    angular.forEach($scope.businessLogo,function(obj){
        formData.append('logo', obj.lfFile);
    });

    angular.forEach($scope.user,function(value, key){
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

}]);