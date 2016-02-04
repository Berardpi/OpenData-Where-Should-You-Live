'use strict';

/**
 * @ngdoc function
 * @name openDataApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the openDataApp
 */
angular.module('openDataApp')
  .controller('MainCtrl', function ($scope, $window, MongoApiSvc, leafletGeoJsonEvents, CriteriasSvc) {
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
        colors[i]= rgb(255, Math.floor(i*255/20) , Math.floor(i*255/20));
    }
    var legend = [];
    for(var i=0; i<20;i++){
        legend[i]="     ";
    }
    legend[0] = "fort";
    legend[10] = "moyen";
    legend[19] = "faible";

    $scope.neighborhood = {};
    $scope.weight = {};

    $scope.getTrad = CriteriasSvc.getTrad;
    $scope.getUnite = CriteriasSvc.getUnite;

    $scope.data = {}
    $scope.data.dimensions = CriteriasSvc.getDimensions();
    $scope.data.weight = {};

      $scope.loadData = function() {
          MongoApiSvc.relativeLoadPerNeighborhood($scope.data.dimensions).then(function (success) {
              if(success != undefined && success.length > 0 && success[0].properties.weight){
                $scope.neighborhood.data = success;

                $scope.weight.min = _.minBy(success, function (o) {
                    return o.properties.weight;
                }).properties.weight;
                $scope.weight.max = _.maxBy(success, function (o) {
                    return o.properties.weight;
                }).properties.weight;
                  /*var grenoble = $scope.neighborhood.data[0];
                   _.forEach($scope.neighborhood.data, function(n) {
                   grenoble = turf.union(grenoble, n);
                   console.log(grenoble);
                   });*/
                  MongoApiSvc.load($scope.data.dimensions).then(function(data) {
                      // console.log(data);
                      var new_geojson = $scope.neighborhood.data.concat(data);
                      $scope.neighborhood.data = new_geojson;
                  });
                $scope.neighborhood.style = getStyle;
              } else {
                $scope.neighborhood.data = { 'properties' : {}, 
                                             'geometry': { 
                                                "type": "Point", 
                                                "coordinates": [-105.01621, 39.57422]
                                              },
                                              'type':"Feature" 
                                            };
              }
          });
      }

       angular.extend($scope, {
           defaults: {
                /*tileLayer: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',*/
                /*maxZoom: 14,*/
               scrollWheelZoom: false
           },
           center: {
               lat: 45.184,
               lng: 5.718,
               zoom: 13
           },
           legend: {
               position: 'bottomright',
               colors: colors,
               labels: legend
           }
       });

      var getStyle = function(feature){
          if(feature.properties.type_amenagement == "Piste cyclable"){
              return {
                  weight: 2,
                  opacity: 1,
                  color: "black"
              }
          } else {
              return {
                  fillColor: getColorArea(feature.properties.weight),
                  weight: 1,
                  opacity: 1,
                  color: "white",
                  dashArray: '3',
                  fillOpacity: 0.5
              };
          }
      };
      var getColorArea = function(weight) {
        var inter = ($scope.weight.max - $scope.weight.min)/18;
        for( var i=0; i<19; i++){
            if(weight >= ($scope.weight.max - (inter *i))){
                return colors[i];
            }
        }
      }
      $scope.$on("leafletDirectiveGeoJson.click", function(ev, leafletPayload) {
          if(leafletPayload.leafletObject.feature.geometry.type == "Polygon") {
              if ($scope.selectedNeightborhood) {
                  $scope.selectedNeightborhood.setStyle({
                      weight: 1,
                      color: "white"
                  });
              }
              $scope.selectedNeightborhood = leafletPayload.leafletObject;
              var center = turf.centroid($scope.selectedNeightborhood.feature);
              $scope.center.lat = center.geometry.coordinates[1];
              $scope.center.lng = center.geometry.coordinates[0];
              leafletPayload.leafletObject.setStyle({
                  weight: 4,
                  color: "green"
              });
          }
      });
      $scope.$on("leafletDirectiveGeoJson.mouseover", function(ev, leafletPayload) {
          $scope.overNeightborhood = leafletPayload.leafletObject.feature;
      });

      $scope.loadData();

      $scope.neighborhoodData = undefined;
      $scope.$watch('selectedNeightborhood', function() {
        if ($scope.selectedNeightborhood != undefined) {
          MongoApiSvc.load("neighborhood?where={\"properties.SDEC_LIBEL\": \"" + $scope.selectedNeightborhood.feature.properties.name + "\"}&projection={\"properties\": 1}").then(function(data) {
            $scope.neighborhoodData = data[0];
            $scope.neighborhoodData.properties.cyclelane_length = Math.round($scope.neighborhoodData.properties.cyclelane_length);
          });
        }
      });
  });
