'use strict';

/**
 * @ngdoc function
 * @name openDataApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the openDataApp
 */
angular.module('openDataApp')
  .controller('MainCtrl', function ($scope, MongoApiSvc) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var rgb = function(r, g, b){
        return ["rgb(",r,",",g,",",b,")"].join("");
    }

    var colors = [];
    for(var i=0; i<20;i++){
        colors[i]= rgb(255, Math.floor(i*255/20) ,0);
    }

    $scope.neighborhoods = {};
    $scope.lenghtNeighborhoods = {};
    $scope.weight = {};

   /*NeighborhoodSvc.load().then(function(success) {
      $scope.neighborhoods.data = success;
      $scope.neighborhoods.style = getStyle;
      CyclelaneSvc.loadInPolygon($scope.neighborhoods.data[0].geometry).then(function(success) {
        $scope.line = success;
      });
    });*/
      // CyclelaneSvc.lengthPerNeighborhood().then(function(success) {

      //     $scope.lenghtNeighborhoods.data = success;
      //     $scope.weight.min = _.minBy(success, function(o) { return o.properties.weight}).properties.weight;
      //     $scope.weight.max = _.maxBy(success, function(o) { return o.properties.weight}).properties.weight;
      //     $scope.lenghtNeighborhoods.style = getStyle;
      // });

      // angular.extend($scope, {
      //     defaults: {
      //         /* tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', //'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
      //          maxZoom: 14,*/
      //         scrollWheelZoom: false
      //     },
      //     center: {
      //         lat: 45.184,
      //         lng: 5.718,
      //         zoom: 13
      //     }
      // });

      var getStyle = function(feature){
          return {
              fillColor: getColor(feature.properties.weight),
              weight: 1,
              opacity: 1,
              color: 'white',
              dashArray: '3',
              fillOpacity: 0.5
          };
      };
      var getColor = function(weight) {
        var inter = ($scope.weight.max - $scope.weight.min)/18;
        for( var i=0; i<19; i++){
            if(weight >= ($scope.weight.max - (inter *i))){
                return colors[i];
            }
        }
      }
  });
