// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var app = angular.module('starter', ['ionic', /*'ionic-material'*/,'starter.controllers', 'starter.services','ngCordova', 'ionic.utils','ionic.rating', 'autocomplete.directive'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    if (window.cordova) {
      cordova.plugins.diagnostic.isLocationEnabled(function(enabled) {
          alert("Location is " + (enabled ? "enabled" : "disabled"));
      }, function(error) {
          alert("The following error occurred: " + error);
      });
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  $ionicConfigProvider.navBar.alignTitle('center');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  .state('eventmenu', {
      url: "/event",
      abstract: true,
      templateUrl: "templates/event-menu.html"
    })
    .state('eventmenu.home', {
      url: "/home",
      views: {
        'menuContent' :{
          templateUrl: "templates/home.html",
          controller: 'HomeCtrl',
        }
      }
    })
  .state('list', {
    url: '/list/:type',
    views: {
      '': {
        templateUrl: 'templates/data-list.html',
        controller: 'DataListCtrl'
      }
    }
  }).state('detail', {
    url: '/detail/:id',
    views: {
      '': {
        templateUrl: 'templates/detail.html',
        controller: 'DetailCtrl'
      }
    }
  }).state('homes', {
          url: '/homes',
          views: {
              '': {
                  templateUrl: 'templates/home.html',
                  controller: 'HomeCtrl',
              }
          }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');
  //$urlRouterProvider.otherwise('/home');
  $urlRouterProvider.otherwise("/event/home");

});
