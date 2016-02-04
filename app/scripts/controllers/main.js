'use strict';

/**
 * @ngdoc function
 * @name openDataApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the openDataApp
 */
angular.module('openDataApp')
  .controller('MainCtrl', function ($scope, $window,leafletGeoJsonEvents, leafletMapEvents,  MongoApiSvc, CriteriasSvc) {
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
              if(success != undefined && success.length > 0 && CriteriasSvc.isThereADimensionSelected()){
                  $scope.layers.overlays = {};
                  $scope.weight.min = _.minBy(success, function (o) {
                      return o.properties.weight;
                  }).properties.weight;
                  $scope.weight.max = _.maxBy(success, function (o) {
                      return o.properties.weight;
                  }).properties.weight;
                  angular.extend($scope.layers.overlays, {
                    neighborhood: {
                        name:'Quartier',
                        type: 'geoJSONShape',
                        data: success,
                        visible: true,
                        layerOptions: {
                            style: getStyle,
                            onEachFeature: getOnEachFeature
                          }
                      }
                  });
                  $scope.layers.overlays.neighborhood.doRefresh = true;
                  if($scope.data.dimensions.gsm_2g_count || $scope.data.dimensions.gsm_3g_count || $scope.data.dimensions.gsm_4g_count ) {
                      MongoApiSvc.load("gsm").then(function (data) {
                          var data_4G = [];
                          var data_3G = [];
                          var data_2G = [];
                          _.forEach(data, function(d){
                              if(d.properties.ANT_4G == "OUI"){
                                  data_4G.push(d);
                              } else if(d.properties.ANT_3G == "OUI"){
                                  data_3G.push(d);
                              } else {
                                  data_2G.push(d);
                              }
                          });
                          if($scope.data.dimensions.gsm_2g_count) {
                              angular.extend($scope.layers.overlays, {
                                  gsm_2G: $scope.createLayer("GSM 2G", data_2G)
                            });
                          }
                          if($scope.data.dimensions.gsm_3g_count) {
                              angular.extend($scope.layers.overlays, {
                                  gsm_3G:  $scope.createLayer("GSM 3G", data_3G)
                              });
                          }
                          if($scope.data.dimensions.gsm_4g_count) {
                              angular.extend($scope.layers.overlays, {
                                  gsm_4G:  $scope.createLayer("GSM 4G", data_4G)
                              });
                          }

                      });
                  }
                  if($scope.data.dimensions.autocar_count || $scope.data.dimensions.bus_count || $scope.data.dimensions.sncf_count || $scope.data.dimensions.tram_count ) {
                      MongoApiSvc.load("stop").then(function (data) {
                          var tram = [];
                          var bus  = [];
                          var sncf  = [];
                          var autocar  = [];
                          _.forEach(data, function(d){
                              var lines = d.properties.LIGNESARRET.split(',');
                              _.each(lines, function(line) {
                                  if (line.match(/SEM_[ABCDE]/)) {
                                      tram.push(d);
                                  } else if (_.startsWith(line, 'SEM_')) {
                                      bus.push(d);
                                  } else if (_.startsWith(line, 'SNC_')) {
                                      sncf.push(d);
                                  } else {
                                      autocar.push(d);
                                  }
                              });
                          });
                          if($scope.data.dimensions.autocar_count) {
                              angular.extend($scope.layers.overlays, {
                                  autocar: $scope.createLayer("Autocar", autocar)
                              });
                          }
                          if($scope.data.dimensions.bus_count) {
                              angular.extend($scope.layers.overlays, {
                                  bus:  $scope.createLayer("Bus", bus)
                              });
                          }
                          if($scope.data.dimensions.sncf_count) {
                              angular.extend($scope.layers.overlays, {
                                  gare:  $scope.createLayer("Gare", sncf)
                              });
                          }
                          if($scope.data.dimensions.tram_count) {
                              angular.extend($scope.layers.overlays, {
                                  tram:  $scope.createLayer("Tram", tram)
                              });
                          }

                      });
                  }
                  if($scope.data.dimensions.citelib_count) {
                      MongoApiSvc.load("citelib").then(function (data) {
                              angular.extend($scope.layers.overlays, {
                                  citeLibs: $scope.createLayer("CiteLibs", data)
                          });
                      });
                  }
              } else {
                  angular.extend($scope.layers.overlays = {});
              }
          });
      }

      $scope.createLayer = function(name, data){
            return {
                  name: name,
                  type: 'geoJSONAwesomeMarker',
                  data: data,
                  visible: false,
                  icon: {
                      icon: 'heart',
                      markerColor: 'red',
                      prefix: 'glyphicon'
                  }
              }
      };

       angular.extend($scope, {
           defaults: {
               scrollWheelZoom: false
           },
           layers: {
               baselayers: {
                   osm: {
                       name: 'OpenStreetMap',
                       url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                       type: 'xyz'
                   },
                   ocm: {
                       name: 'OpenCycleMap',
                       url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
                       type: 'xyz'
                   }
               },
               overlays:{}
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
              return {
                  fillColor: getColorArea(feature.properties.weight),
                  weight: 1,
                  opacity: 1,
                  color: "white",
                  dashArray: '3',
                  fillOpacity: 0.5
              };
      };

      var getOnEachFeature = function(feature, layer){
          layer.on('click', function(e) {
              if ($scope.selectedNeightborhood) {
                  $scope.selectedNeightborhood.setStyle({
                      weight: 1,
                      color: "white"
                  });
              }
              $scope.selectedNeightborhood = e.target;
              var center = turf.centroid($scope.selectedNeightborhood.feature);
              $scope.center.lat = center.geometry.coordinates[1];
              $scope.center.lng = center.geometry.coordinates[0];
              e.target.setStyle({
                  weight: 4,
                  color: "green"
              });
          });
          layer.on('mouseover', function(e) {
              $scope.overNeightborhood = feature;
          });
          };

      var getColorArea = function(weight) {
        var inter = ($scope.weight.max - $scope.weight.min)/18;
        for( var i=0; i<19; i++){
            if(weight >= ($scope.weight.max - (inter *i))){
                return colors[i];
            }
        }
      }

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
