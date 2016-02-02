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
    $scope.data = [];

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

  });
