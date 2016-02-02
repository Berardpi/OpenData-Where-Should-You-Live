'use strict';

/**
 * @ngdoc function
 * @name openDataApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the openDataApp
 */
angular.module('openDataApp')
  .controller('MainCtrl', function ($scope, NeighborhoodSvc, CyclelaneSvc, StopSvc) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.neighborhoods = {};
    $scope.lenghtNeighborhoods = {};

   /*NeighborhoodSvc.load().then(function(success) {
      $scope.neighborhoods.data = success;
      $scope.neighborhoods.style = getStyle;
      CyclelaneSvc.loadInPolygon($scope.neighborhoods.data[0].geometry).then(function(success) {
        $scope.line = success;
      });
    });*/
      CyclelaneSvc.lengthPerNeighborhood().then(function(success) {
          $scope.lenghtNeighborhoods.data = success;
          $scope.lenghtNeighborhoods.style = getStyle;
      });

      angular.extend($scope, {
          defaults: {
              /* tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', //'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
               maxZoom: 14,*/
              scrollWheelZoom: false
          },
          center: {
              lat: 45.180,
              lng: 5.728,
              zoom: 12
          }
      });

      var getStyle = function(feature){
          return {
              fillColor: getColor(feature.properties.SDEC_LIBEL),
              weight: 2,
              opacity: 1,
              color: 'white',
              dashArray: '3',
              fillOpacity: 0.3
          };
      };
      var getColor = function(name) {
          var rand = Math.floor((Math.random()*10));
          if(name == "Centre Gare") {
              return "yellow";
          } else if(rand%3==0){
              return "red"
          } else if (rand%3 ==1){
              return "green";
          } else {
              return "blue";
          }
      }
  });
