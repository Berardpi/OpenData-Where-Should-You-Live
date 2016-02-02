"use strict";

angular.module('ParallelCoordinates',['MongoApi'])
  .controller('ParallelCoordinatesCtrl', function ($scope, MongoApiSvc) {

    $scope.criteria = "cyclelane";
    $scope.criteriaTraduc = {
      'cyclelane' : 'Vélo voies',
      'stop' : 'Arrêts de tram',
      'citelib' : 'Citélib',
      'gsm' : 'GSM'
    }
/*
    $scope.data = { 'dimensions' : {'velo' : true, 'stop': true, 'gsm': true}, 
      'data': [  
        {'name': 'quartier1', 'properties': {'velo': 1, 'stop': 3, 'gsm': 1}},
        {'name': 'quartier2', 'properties': {'velo': 2, 'stop': 2, 'gsm': 4}},
      ]
    };*/

$scope.data= { 'dimensions' : {                      
                        'autocar_count' : false,
                        'bus_count' : false,
                        'citelib_count' : false,
                        'gsm_2g_count' : false,
                        'gsm_3g_count' : false,
                        'gsm_4g_count' : false,
                        'sncf_count' : false,
                        'tram_count' : false,
                        'cyclelane_length' : false,
                      },
                     'data': []
                    };

    MongoApiSvc.loadPerNeighborhood('cyclelane').then(function(data) {
      console.log(data);
      var newDim = $scope.data.dimensions;
      newDim.tram_count = true;
      newDim.bus_count = true;
      $scope.data= { 'dimensions' : $scope.data.dimensions,
                     'data': data
                    };

      //$scope.data.data = data;
    });
/*
    $scope.loadData = function(){
      console.log("loadData");
      MongoApiSvc.loadPerNeighborhood().then(function(data){
        $scope.data= { 'dimensions' : {'velo' : true, 'stop': true, 'gsm': true}, 
                     'data': data
                    };
      });
    }
    */

  });
