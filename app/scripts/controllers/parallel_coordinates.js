"use strict";

angular.module('ParallelCoordinates',['Cyclelane', 'Stop', 'Gsm', 'Citelib'])
  .controller('ParallelCoordinatesCtrl', function ($scope, CyclelaneSvc, StopSvc, GsmSvc, CitelibSvc) {

    $scope.criteria = "cyclelane";
    $scope.criteriaTraduc = {
      'cyclelane' : 'Vélo voies',
      'stop' : 'Arrêts de tram',
      'citelib' : 'Citélib',
      'gsm' : 'GSM'
    }
    $scope.data = [  
        {'name': 'quartier1', 'velo': 1, 'stop': 3, 'gsm': 1},
        {'name': 'quartier2', 'velo': 2, 'stop': 2, 'gsm': 4},
      ];
/*
    CyclelaneSvc.lengthPerNeighborhood().then(function(data){
      $scope.data = data;
    });
    
    $scope.loadData = function(){
      console.log("loadData");
      var dataLoader = CyclelaneSvc.lengthPerNeighborhood;
      if($scope.criteria === "cyclelane"){
        dataLoader = CyclelaneSvc.lengthPerNeighborhood;
      } else if($scope.criteria === "stop"){
        dataLoader = StopSvc.loadPerNeighborhood;
      } else if($scope.criteria === "citelib"){
        dataLoader = CitelibSvc.loadPerNeighborhood;
      } else if($scope.criteria === "gsm"){
        dataLoader = GsmSvc.loadPerNeighborhood;
      }

      dataLoader().then(function(data){
        $scope.data = data;
      });
    }
*/
  });
