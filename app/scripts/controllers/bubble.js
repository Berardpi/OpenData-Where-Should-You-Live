"use strict";

angular.module('Bubble',['MongoApi'])
  .controller('BubbleCtrl', function ($scope, MongoApiSvc) {
    $scope.crit = {};
    $scope.crit.criteria = undefined;
    $scope.criterias = {};

    $scope.criteriaTraduc = {
      'cyclelane' : 'Vélo voies',
      'stop' : 'Arrêts de tram',
      'citelib' : 'Citélib',
      'gsm' : 'GSM'
    }

    $scope.data = [];

    $scope.loadData = function(){
      if($scope.crit.criteria !== undefined){
        console.log("loadData "+ JSON.stringify($scope.crit.criteria));
        MongoApiSvc.loadPerNeighborhood($scope.crit.criteria).then(function(data){
          $scope.data = data;
        });
      }
    }

  });
