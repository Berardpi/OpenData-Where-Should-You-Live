'use strict';

/**
 * @ngdoc overview
 * @name openDataApp
 * @description
 * # openDataApp
 *
 * Main module of the application.
 */
angular
  .module('openDataApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'nemLogging',
    'ui-leaflet',
    'Navbar',
    'Bubble',
    'ParallelCoordinates',
    'MongoApi',
    'Criterias'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/bubble', {
        templateUrl: 'views/bubble.html',
        controller: 'BubbleCtrl',
        controllerAs: 'bubble'
      })
      .when('/parallel_coordinates', {
        templateUrl: 'views/parallel_coordinates.html',
        controller: 'ParallelCoordinatesCtrl',
        controllerAs: 'parallelCoordinates'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
