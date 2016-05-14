'use strict';

 var app = angular
  .module('bizzmap', [
    'ngMaterial', 
    'users', 
    'ui.router',
    'lfNgMdFileInput'
])
  .config(['$mdThemingProvider', '$mdIconProvider', '$stateProvider', '$urlRouterProvider',
    function($mdThemingProvider, $mdIconProvider, $stateProvider, $urlRouterProvider){

      $mdIconProvider
          .defaultIconSet("./assets/svg/avatars.svg", 128)
          .icon("menu"       , "./assets/svg/menu.svg"        , 24)
          .icon("email"       , "./assets/svg/email.svg"        , 24)
          .icon("contact"       , "./assets/svg/contact.svg"        , 24)
          .icon("person"       , "./assets/svg/person.svg"        , 24)
          .icon("location"       , "./assets/svg/location.svg"        , 24)
          .icon("share"      , "./assets/svg/share.svg"       , 24)
          .icon("google_plus", "./assets/svg/google_plus.svg" , 512)
          .icon("hangouts"   , "./assets/svg/hangouts.svg"    , 512)
          .icon("twitter"    , "./assets/svg/twitter.svg"     , 512)
          .icon("phone"      , "./assets/svg/phone.svg"       , 512);

          $mdThemingProvider.theme('default')
              .primaryPalette('blue')
              .accentPalette('red');

    $urlRouterProvider.otherwise("/");

    // Course List screen
    $stateProvider.state("add-business", {
        url: "/add-business",
        templateUrl: "admin/views/add-business.html",
        controller: "AddBusinessCtrl",
    
    });

}]);
