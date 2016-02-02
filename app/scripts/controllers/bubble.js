"use strict";

angular.module('Bubble',['Cyclelane', 'Neighborhood'])
  .controller('BubbleCtrl', function ($scope, CyclelaneSvc, NeighborhoodSvc) {

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
        // TODO
      } else if($scope.criteria === "citelib"){
        // TODO
      } else if($scope.criteria === "gsm"){
        // TODO
      }

      dataLoader().then(function(data){
        $scope.data = data;
      });
    }

  });

  