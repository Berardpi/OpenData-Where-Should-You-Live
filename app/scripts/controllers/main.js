'use strict';

/**
 * @ngdoc function
 * @name openDataApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the openDataApp
 */
angular.module('openDataApp')
  .controller('MainCtrl', function ($scope, NeighborhoodSvc, CyclelaneSvc) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    angular.extend($scope, {
      defaults: {
          tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', //'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
          maxZoom: 14,
          path: {
              weight: 10,
              color: '#800000',
              opacity: 1
          }
      },
      center: {
          lat: 45.180,
          lng: 5.728,
          zoom: 12
      }
    });

    $scope.salesData=[
        {hour: 1,sales: 54},
        {hour: 2,sales: 66},
        {hour: 3,sales: 77},
        {hour: 4,sales: 70},
        {hour: 5,sales: 60},
        {hour: 6,sales: 63},
        {hour: 7,sales: 55},
        {hour: 8,sales: 47},
        {hour: 9,sales: 55},
        {hour: 10,sales: 30}
    ];

    NeighborhoodSvc.load().then(function(success) {
      $scope.neighborhoods = success._items;
      CyclelaneSvc.loadInPolygon($scope.neighborhoods[0].geometry).then(function(success) {
        $scope.line = success._items;
      });
    });
  });
